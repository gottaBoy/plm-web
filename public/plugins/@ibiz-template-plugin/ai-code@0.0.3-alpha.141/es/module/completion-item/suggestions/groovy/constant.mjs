"use strict";
const KEY_WORDS = [
  // Groovy 关键字
  {
    label: "def",
    kind: 17,
    documentation: "\u5B9A\u4E49\u53D8\u91CF",
    insertText: "def "
  },
  {
    label: "return",
    kind: 17,
    documentation: "\u8FD4\u56DE\u503C",
    insertText: "return "
  },
  {
    label: "if",
    kind: 17,
    documentation: "\u6761\u4EF6\u8BED\u53E5",
    insertText: "if (${1:condition}) {\n	${2:// code}\n}",
    insertTextRules: 4
  },
  {
    label: "else",
    kind: 17,
    documentation: "else \u8BED\u53E5",
    insertText: "else "
  },
  {
    label: "for",
    kind: 17,
    documentation: "for \u5FAA\u73AF",
    insertText: "for (${1:item} in ${2:collection}) {\n	${3:// code}\n}",
    insertTextRules: 4
  },
  {
    label: "while",
    kind: 17,
    documentation: "while \u5FAA\u73AF",
    insertText: "while (${1:condition}) {\n	${2:// code}\n}",
    insertTextRules: 4
  },
  {
    label: "switch",
    kind: 17,
    documentation: "switch \u8BED\u53E5",
    insertText: "switch (${1:value}) {\n	${2:// cases}\n}",
    insertTextRules: 4
  },
  {
    label: "case",
    kind: 17,
    documentation: "case \u5206\u652F",
    insertText: "case ${1:value}:\n	${2:// code}\n	break",
    insertTextRules: 4
  },
  {
    label: "break",
    kind: 17,
    documentation: "\u8DF3\u51FA\u5FAA\u73AF\u6216switch",
    insertText: "break"
  },
  {
    label: "continue",
    kind: 17,
    documentation: "\u7EE7\u7EED\u4E0B\u4E00\u6B21\u5FAA\u73AF",
    insertText: "continue"
  },
  {
    label: "throw",
    kind: 17,
    documentation: "\u629B\u51FA\u5F02\u5E38",
    insertText: "throw new ${1:Exception}(${2:message})",
    insertTextRules: 4
  },
  {
    label: "try",
    kind: 17,
    documentation: "\u5F02\u5E38\u5904\u7406",
    insertText: "try {\n	${1:// code}\n} catch (${2:Exception} ${3:e}) {\n	${4:// handle}\n}",
    insertTextRules: 4
  },
  {
    label: "catch",
    kind: 17,
    documentation: "\u6355\u83B7\u5F02\u5E38",
    insertText: "catch (${1:Exception} ${2:e}) {\n	${3:// handle}\n}",
    insertTextRules: 4
  },
  {
    label: "finally",
    kind: 17,
    documentation: "finally \u5757",
    insertText: "finally {\n	${1:// code}\n}",
    insertTextRules: 4
  },
  // Groovy 特殊关键字
  {
    label: "as",
    kind: 17,
    documentation: "\u7C7B\u578B\u8F6C\u6362",
    insertText: "as "
  },
  {
    label: "in",
    kind: 17,
    documentation: "\u5728\u96C6\u5408\u4E2D",
    insertText: "in "
  },
  // 访问修饰符
  {
    label: "public",
    kind: 17,
    documentation: "\u516C\u5171\u8BBF\u95EE",
    insertText: "public "
  },
  {
    label: "private",
    kind: 17,
    documentation: "\u79C1\u6709\u8BBF\u95EE",
    insertText: "private "
  },
  {
    label: "protected",
    kind: 17,
    documentation: "\u53D7\u4FDD\u62A4\u8BBF\u95EE",
    insertText: "protected "
  },
  // 类相关关键字
  {
    label: "class",
    kind: 17,
    documentation: "\u5B9A\u4E49\u7C7B",
    insertText: "class ${1:ClassName} {\n	${2:// class body}\n}",
    insertTextRules: 4
  },
  {
    label: "interface",
    kind: 17,
    documentation: "\u5B9A\u4E49\u63A5\u53E3",
    insertText: "interface ${1:InterfaceName} {\n	${2:// methods}\n}",
    insertTextRules: 4
  },
  {
    label: "extends",
    kind: 17,
    documentation: "\u7EE7\u627F\u7C7B",
    insertText: "extends "
  },
  {
    label: "implements",
    kind: 17,
    documentation: "\u5B9E\u73B0\u63A5\u53E3",
    insertText: "implements "
  },
  {
    label: "new",
    kind: 17,
    documentation: "\u521B\u5EFA\u5BF9\u8C61",
    insertText: "new ${1:Type}(${2:args})",
    insertTextRules: 4
  },
  {
    label: "this",
    kind: 17,
    documentation: "\u5F53\u524D\u5BF9\u8C61",
    insertText: "this"
  },
  {
    label: "super",
    kind: 17,
    documentation: "\u7236\u7C7B\u5BF9\u8C61",
    insertText: "super"
  },
  // 导入相关
  {
    label: "import",
    kind: 17,
    documentation: "\u5BFC\u5165\u5305",
    insertText: "import "
  },
  {
    label: "package",
    kind: 17,
    documentation: "\u5B9A\u4E49\u5305",
    insertText: "package "
  },
  // 布尔值和null
  {
    label: "true",
    kind: 17,
    documentation: "\u5E03\u5C14\u771F\u503C",
    insertText: "true"
  },
  {
    label: "false",
    kind: 17,
    documentation: "\u5E03\u5C14\u5047\u503C",
    insertText: "false"
  },
  {
    label: "null",
    kind: 17,
    documentation: "\u7A7A\u503C",
    insertText: "null"
  },
  // Groovy 特有
  {
    label: "it",
    kind: 17,
    documentation: "\u9690\u5F0F\u53C2\u6570",
    insertText: "it"
  },
  {
    label: "with",
    kind: 17,
    documentation: "with \u64CD\u4F5C\u7B26",
    insertText: "with {\n	${1:// code}\n}",
    insertTextRules: 4
  }
];
const DATA_TYPES = [
  {
    kind: 24,
    label: "String",
    insertText: "String",
    documentation: "\u5B57\u7B26\u4E32\u7C7B\u578B"
  },
  {
    kind: 24,
    label: "Integer",
    insertText: "Integer",
    documentation: "\u6574\u6570\u5BF9\u8C61\u7C7B\u578B"
  },
  {
    kind: 24,
    label: "Boolean",
    insertText: "Boolean",
    documentation: "\u5E03\u5C14\u5BF9\u8C61\u7C7B\u578B"
  },
  { kind: 24, label: "List", insertText: "List", documentation: "\u5217\u8868\u7C7B\u578B" },
  { kind: 24, label: "Map", insertText: "Map", documentation: "\u6620\u5C04\u7C7B\u578B" },
  { kind: 24, label: "Set", insertText: "Set", documentation: "\u96C6\u5408\u7C7B\u578B" },
  {
    kind: 24,
    label: "Closure",
    insertText: "Closure",
    documentation: "\u95ED\u5305\u7C7B\u578B"
  }
];
const COLLECTION_METHODS = [
  {
    label: "each",
    kind: 0,
    documentation: "\u904D\u5386\u96C6\u5408\u4E2D\u7684\u6BCF\u4E2A\u5143\u7D20",
    insertText: "each { ${1:item} ->\n	${2:// code}\n}",
    insertTextRules: 4
  },
  {
    label: "collect",
    kind: 0,
    documentation: "\u8F6C\u6362\u96C6\u5408\u4E2D\u7684\u6BCF\u4E2A\u5143\u7D20",
    insertText: "collect { ${1:item} ->\n	${2:transformedItem}\n}",
    insertTextRules: 4
  },
  {
    label: "findAll",
    kind: 0,
    documentation: "\u67E5\u627E\u6240\u6709\u5339\u914D\u7684\u5143\u7D20",
    insertText: "findAll { ${1:item} ->\n	${2:condition}\n}",
    insertTextRules: 4
  },
  {
    label: "join",
    kind: 0,
    documentation: "\u7528\u5206\u9694\u7B26\u8FDE\u63A5\u96C6\u5408\u5143\u7D20",
    insertText: 'join("${1:,}")',
    insertTextRules: 4
  },
  {
    label: "reverse",
    kind: 0,
    documentation: "\u53CD\u8F6C\u96C6\u5408\u987A\u5E8F",
    insertText: "reverse()"
  },
  {
    label: "sort",
    kind: 0,
    documentation: "\u6392\u5E8F\u96C6\u5408",
    insertText: "sort()"
  },
  {
    label: "unique",
    kind: 0,
    documentation: "\u53BB\u9664\u91CD\u590D\u5143\u7D20",
    insertText: "unique()"
  },
  {
    label: "size",
    kind: 0,
    documentation: "\u83B7\u53D6\u96C6\u5408\u5927\u5C0F",
    insertText: "size()"
  }
];
const MAP_METHODS = [
  {
    label: "each",
    kind: 0,
    documentation: "\u904D\u5386Map\u4E2D\u7684\u6BCF\u4E2A\u952E\u503C\u5BF9",
    insertText: "each { ${1:key}, ${2:value} ->\n	${3:// code}\n}",
    insertTextRules: 4
  },
  {
    label: "each",
    kind: 0,
    documentation: "\u904D\u5386Map\u4E2D\u7684\u6BCF\u4E2A\u6761\u76EE",
    insertText: "each { ${1:entry} ->\n	${2:// code}\n}",
    insertTextRules: 4
  },
  {
    label: "collect",
    kind: 0,
    documentation: "\u8F6C\u6362Map\u4E2D\u7684\u6BCF\u4E2A\u952E\u503C\u5BF9",
    insertText: "collect { ${1:key}, ${2:value} ->\n	${3:transformedValue}\n}",
    insertTextRules: 4
  },
  {
    label: "find",
    kind: 0,
    documentation: "\u67E5\u627E\u7B2C\u4E00\u4E2A\u5339\u914D\u7684\u952E\u503C\u5BF9",
    insertText: "find { ${1:key}, ${2:value} ->\n	${3:condition}\n}",
    insertTextRules: 4
  },
  {
    label: "findAll",
    kind: 0,
    documentation: "\u67E5\u627E\u6240\u6709\u5339\u914D\u7684\u952E\u503C\u5BF9",
    insertText: "findAll { ${1:key}, ${2:value} ->\n	${3:condition}\n}",
    insertTextRules: 4
  },
  {
    label: "get",
    kind: 0,
    documentation: "\u6839\u636E\u952E\u83B7\u53D6\u503C",
    insertText: 'get("${1:key}")',
    insertTextRules: 4
  },
  {
    label: "put",
    kind: 0,
    documentation: "\u6DFB\u52A0\u6216\u66F4\u65B0\u952E\u503C\u5BF9",
    insertText: 'put("${1:key}", ${2:value})',
    insertTextRules: 4
  },
  {
    label: "putAll",
    kind: 0,
    documentation: "\u6DFB\u52A0\u53E6\u4E00\u4E2AMap\u7684\u6240\u6709\u952E\u503C\u5BF9",
    insertText: "putAll(${1:otherMap})"
  },
  {
    label: "remove",
    kind: 0,
    documentation: "\u6839\u636E\u952E\u79FB\u9664\u952E\u503C\u5BF9",
    insertText: 'remove("${1:key}")',
    insertTextRules: 4
  },
  {
    label: "containsKey",
    kind: 0,
    documentation: "\u68C0\u67E5\u662F\u5426\u5305\u542B\u6307\u5B9A\u952E",
    insertText: 'containsKey("${1:key}")',
    insertTextRules: 4
  },
  {
    label: "containsValue",
    kind: 0,
    documentation: "\u68C0\u67E5\u662F\u5426\u5305\u542B\u6307\u5B9A\u503C",
    insertText: "containsValue(${1:value})",
    insertTextRules: 4
  },
  {
    label: "keySet",
    kind: 0,
    documentation: "\u83B7\u53D6\u6240\u6709\u952E\u7684\u96C6\u5408",
    insertText: "keySet()"
  },
  {
    label: "values",
    kind: 0,
    documentation: "\u83B7\u53D6\u6240\u6709\u503C\u7684\u96C6\u5408",
    insertText: "values()"
  },
  {
    label: "entrySet",
    kind: 0,
    documentation: "\u83B7\u53D6\u6240\u6709\u6761\u76EE\u7684\u96C6\u5408",
    insertText: "entrySet()"
  },
  {
    label: "size",
    kind: 0,
    documentation: "\u83B7\u53D6\u952E\u503C\u5BF9\u6570\u91CF",
    insertText: "size()"
  },
  {
    label: "isEmpty",
    kind: 0,
    documentation: "\u68C0\u67E5Map\u662F\u5426\u4E3A\u7A7A",
    insertText: "isEmpty()"
  },
  {
    label: "clear",
    kind: 0,
    documentation: "\u6E05\u7A7A\u6240\u6709\u952E\u503C\u5BF9",
    insertText: "clear()"
  },
  {
    label: "getOrDefault",
    kind: 0,
    documentation: "\u83B7\u53D6\u503C\uFF0C\u5982\u679C\u4E0D\u5B58\u5728\u8FD4\u56DE\u9ED8\u8BA4\u503C",
    insertText: 'getOrDefault("${1:key}", ${2:defaultValue})',
    insertTextRules: 4
  },
  {
    label: "findResult",
    kind: 0,
    documentation: "\u67E5\u627E\u7B2C\u4E00\u4E2A\u975E\u7A7A\u7ED3\u679C",
    insertText: "findResult { ${1:key}, ${2:value} ->\n	${3:result}\n}",
    insertTextRules: 4
  },
  {
    label: "groupBy",
    kind: 0,
    documentation: "\u6839\u636E\u6761\u4EF6\u5206\u7EC4",
    insertText: "groupBy { ${1:key}, ${2:value} ->\n	${3:groupKey}\n}",
    insertTextRules: 4
  },
  {
    label: "count",
    kind: 0,
    documentation: "\u7EDF\u8BA1\u6EE1\u8DB3\u6761\u4EF6\u7684\u952E\u503C\u5BF9\u6570\u91CF",
    insertText: "count { ${1:key}, ${2:value} ->\n	${3:condition}\n}",
    insertTextRules: 4
  },
  {
    label: "sort",
    kind: 0,
    documentation: "\u6839\u636E\u952E\u6392\u5E8F",
    insertText: "sort()"
  },
  {
    label: "sort",
    kind: 0,
    documentation: "\u4F7F\u7528\u6BD4\u8F83\u5668\u6392\u5E8F",
    insertText: "sort { ${1:entry1}, ${2:entry2} ->\n	${3:comparison}\n}",
    insertTextRules: 4
  },
  {
    label: "inject",
    kind: 0,
    documentation: "\u7D2F\u79EF\u64CD\u4F5C",
    insertText: "inject(${1:initialValue}) { ${2:acc}, ${3:key}, ${4:value} ->\n	${5:result}\n}",
    insertTextRules: 4
  }
];
const STRING_METHODS = [
  {
    label: "each",
    kind: 0,
    documentation: "\u904D\u5386\u5B57\u7B26\u4E32\u4E2D\u7684\u6BCF\u4E2A\u5B57\u7B26",
    insertText: "each { ${1:ch} ->\n	${2:// code}\n}",
    insertTextRules: 4
  },
  {
    label: "reverse",
    kind: 0,
    documentation: "\u53CD\u8F6C\u5B57\u7B26\u4E32",
    insertText: "reverse()"
  },
  {
    label: "split",
    kind: 0,
    documentation: "\u6309\u6B63\u5219\u8868\u8FBE\u5F0F\u5206\u5272\u5B57\u7B26\u4E32",
    insertText: "split(/${1:pattern}/)",
    insertTextRules: 4
  },
  {
    label: "join",
    kind: 0,
    documentation: "\u8FDE\u63A5\u5B57\u7B26\u4E32\u6570\u7EC4",
    insertText: 'join("${1:,}")',
    insertTextRules: 4
  },
  {
    label: "length",
    kind: 0,
    documentation: "\u83B7\u53D6\u5B57\u7B26\u4E32\u957F\u5EA6",
    insertText: "length()"
  },
  {
    label: "substring",
    kind: 0,
    documentation: "\u63D0\u53D6\u5B50\u5B57\u7B26\u4E32",
    insertText: "substring(${1:beginIndex})",
    insertTextRules: 4
  }
];
const NUMBAR_METHODS = [
  {
    label: "each",
    kind: 0,
    documentation: "\u904D\u5386\u6570\u5B57\u8303\u56F4",
    insertText: "each { ${1:num} ->\n	${2:// code}\n}",
    insertTextRules: 4
  },
  {
    label: "reverse",
    kind: 0,
    documentation: "\u53CD\u8F6C\u6570\u5B57\u8303\u56F4",
    insertText: "reverse()"
  },
  {
    label: "join",
    kind: 0,
    documentation: "\u5C06\u6570\u5B57\u8FDE\u63A5\u4E3A\u5B57\u7B26\u4E32",
    insertText: 'join("${1:,}")',
    insertTextRules: 4
  }
];
const COMMON_METHODS = [
  {
    label: "toString",
    kind: 0,
    documentation: "\u8F6C\u6362\u4E3A\u5B57\u7B26\u4E32",
    insertText: "toString()"
  },
  {
    label: "asType",
    kind: 0,
    documentation: "\u8F6C\u6362\u4E3A\u6307\u5B9A\u7C7B\u578B",
    insertText: "asType(${1:Class})",
    insertTextRules: 4
  }
];
const COMMON_FUNCTION = [
  // 输出
  {
    label: "println",
    kind: 1,
    documentation: "\u8F93\u51FA\u4E00\u884C\u6587\u672C\u5E76\u6362\u884C",
    insertText: "println(${1:value})",
    insertTextRules: 4
  },
  {
    label: "print",
    kind: 1,
    documentation: "\u8F93\u51FA\u6587\u672C\u4E0D\u6362\u884C",
    insertText: "print(${1:value})",
    insertTextRules: 4
  },
  {
    label: "printf",
    kind: 1,
    documentation: "\u683C\u5F0F\u5316\u8F93\u51FA",
    insertText: 'printf("${1:format}", ${2:args})',
    insertTextRules: 4
  },
  {
    label: "sprintf",
    kind: 1,
    documentation: "\u8FD4\u56DE\u683C\u5F0F\u5316\u5B57\u7B26\u4E32",
    insertText: 'sprintf("${1:format}", ${2:args})',
    insertTextRules: 4
  },
  // 断言和工具方法
  {
    label: "assert",
    kind: 1,
    documentation: "\u65AD\u8A00\u6761\u4EF6\u4E3A\u771F",
    insertText: "assert ${1:condition}",
    insertTextRules: 4
  },
  {
    label: "sleep",
    kind: 1,
    documentation: "\u6682\u505C\u6267\u884C\u6307\u5B9A\u7684\u6BEB\u79D2\u6570",
    insertText: "sleep(${1:millis})",
    insertTextRules: 4
  },
  {
    label: "psdecodelist",
    kind: 1,
    documentation: "\u4EE3\u7801\u8868",
    insertText: "psdecodelist(${1:params}) {\n	${2:// code}\n}",
    insertTextRules: 4
  }
];

export { COLLECTION_METHODS, COMMON_FUNCTION, COMMON_METHODS, DATA_TYPES, KEY_WORDS, MAP_METHODS, NUMBAR_METHODS, STRING_METHODS };
