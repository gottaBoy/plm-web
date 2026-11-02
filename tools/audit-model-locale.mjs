import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import ts from 'typescript';

const root = fileURLToPath(new URL('../', import.meta.url));

export function collectModelLabels(filename, source, displayKeys) {
  const tree = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true);
  if (tree.parseDiagnostics.length) {
    throw new Error(`Cannot parse model: ${filename}`);
  }
  const labels = [];
  const visit = node => {
    const fieldList = node.parent?.parent?.parent;
    const fieldLogicName = node.name?.text === 'logicName' &&
      fieldList && ts.isPropertyAssignment(fieldList) &&
      fieldList.name?.text === 'appDEFields';
    if (ts.isPropertyAssignment(node) &&
        (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name)) &&
        (displayKeys.has(node.name.text) || fieldLogicName) &&
        (ts.isStringLiteral(node.initializer) ||
          ts.isNoSubstitutionTemplateLiteral(node.initializer)) &&
        /[\u3400-\u9fff]/u.test(node.initializer.text)) {
      labels.push({
        value: node.initializer.text,
        line: tree.getLineAndCharacterOfPosition(node.getStart(tree)).line + 1,
      });
    }
    ts.forEachChild(node, visit);
  };
  visit(tree);
  return labels;
}

export function auditModelLocale(modelRoot, dictionary, displayKeys) {
  const inventory = new Map();
  let files = 0;
  const scan = directory => {
    for (const entry of readdirSync(directory, { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
      const filename = path.join(directory, entry.name);
      if (entry.isDirectory()) scan(filename);
      else if (entry.isFile() && filename.endsWith('.ts')) {
        files += 1;
        for (const label of collectModelLabels(filename,
          readFileSync(filename, 'utf8'), displayKeys)) {
          const item = inventory.get(label.value) || {
            value: label.value, occurrences: 0,
            translated: Object.hasOwn(dictionary, label.value) &&
              typeof dictionary[label.value] === 'string' &&
              dictionary[label.value].trim().length > 0 &&
              !/[\u3400-\u9fff]/u.test(dictionary[label.value]),
            firstPath: path.relative(modelRoot, filename),
            line: label.line,
          };
          item.occurrences += 1;
          inventory.set(label.value, item);
        }
      }
    }
  };
  scan(modelRoot);
  const labels = [...inventory.values()].sort((a, b) =>
    b.occurrences - a.occurrences || a.value.localeCompare(b.value, 'zh-CN'));
  const translated = labels.filter(item => item.translated);
  return {
    scope: 'Static model display properties only; includes internal control captions, excludes plugins, dynamic API data and full UI acceptance',
    files,
    occurrences: labels.reduce((sum, item) => sum + item.occurrences, 0),
    translatedOccurrences: translated.reduce((sum, item) => sum + item.occurrences, 0),
    uniqueLabels: labels.length,
    translatedUniqueLabels: translated.length,
    untranslated: labels.filter(item => !item.translated),
  };
}

export function currentModelLocaleAudit() {
  const dictionary = JSON.parse(readFileSync(path.join(root, 'src/locale/en.json'), 'utf8'));
  const source = readFileSync(path.join(root, 'src/locale/model-locale.ts'), 'utf8');
  const exports = {};
  vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText, {
    exports,
    require(name) {
      if (name !== './en.json') throw new Error(`Unexpected locale import: ${name}`);
      return dictionary;
    },
  });
  return auditModelLocale(path.join(root, 'src/publish/model'), dictionary, exports.displayKeys);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(currentModelLocaleAudit(), null, 2));
}
