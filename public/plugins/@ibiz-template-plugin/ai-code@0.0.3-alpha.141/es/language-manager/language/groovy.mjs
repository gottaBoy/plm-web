"use strict";
const GroovyConfiguration = {
  comments: {
    lineComment: "//",
    blockComment: ["/*", "*/"]
  },
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"]
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" }
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" }
  ]
};
const GroovyLanguage = {
  keywords: [
    "as",
    "assert",
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "def",
    "default",
    "do",
    "else",
    "enum",
    "extends",
    "false",
    "finally",
    "for",
    "goto",
    "if",
    "implements",
    "import",
    "in",
    "instanceof",
    "interface",
    "new",
    "null",
    "package",
    "return",
    "super",
    "switch",
    "this",
    "throw",
    "throws",
    "trait",
    "true",
    "try",
    "while",
    "abstract",
    "boolean",
    "byte",
    "char",
    "double",
    "final",
    "float",
    "int",
    "long",
    "native",
    "private",
    "protected",
    "public",
    "short",
    "static",
    "synchronized",
    "transient",
    "volatile"
  ],
  typeKeywords: [
    "boolean",
    "byte",
    "char",
    "double",
    "float",
    "int",
    "long",
    "short",
    "void"
  ],
  // 添加 Groovy 常用内置方法
  builtinFunctions: [
    "println",
    "print",
    "printf",
    "sprintf",
    "assert",
    "sleep",
    "each",
    "eachWithIndex",
    "collect",
    "find",
    "findAll",
    "grep",
    "inject",
    "sum",
    "join",
    "split",
    "tokenize",
    "reverse",
    "sort",
    "unique",
    "min",
    "max",
    "count",
    "size",
    "length",
    "contains",
    "startsWith",
    "endsWith",
    "matches",
    "replace",
    "replaceAll",
    "substring",
    "toInteger",
    "toLong",
    "toFloat",
    "toDouble",
    "toBoolean",
    "toList",
    "toSet",
    "toArray",
    "asType"
  ],
  operators: [
    "=",
    ">",
    "<",
    "!",
    "~",
    "?",
    ":",
    "==",
    "<=",
    ">=",
    "!=",
    "&&",
    "||",
    "++",
    "--",
    "+",
    "-",
    "*",
    "/",
    "&",
    "|",
    "^",
    "%",
    "<<",
    ">>",
    ">>>",
    "+=",
    "-=",
    "*=",
    "/=",
    "&=",
    "|=",
    "^=",
    "%=",
    "<<=",
    ">>=",
    ">>>=",
    "->",
    "?.",
    "*.",
    "::"
  ],
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  tokenizer: {
    root: [
      // 类名识别 - 以大写字母开头的标识符
      [/[A-Z][\w\$]*/, "type.identifier"],
      // 标识符和关键字
      [
        /[a-z_$][\w$]*/,
        {
          cases: {
            "@keywords": "keyword",
            "@typeKeywords": "keyword.type",
            "@builtinFunctions": "support.function.method",
            "@default": "identifier"
          }
        }
      ],
      { include: "@whitespace" },
      // 分隔符和括号
      [/[{}()\[\]]/, "@brackets"],
      [/[<>](?!@symbols)/, "@brackets"],
      // 操作符
      [
        /@symbols/,
        {
          cases: {
            "@operators": "operator",
            "@default": ""
          }
        }
      ],
      // 数字
      [/\d*\.\d+([eE][\-+]?\d+)?[fFdD]?/, "number.float"],
      [/0[xX][0-9a-fA-F]+/, "number.hex"],
      [/\d+/, "number"],
      // 分隔符
      [/[;,.]/, "delimiter"],
      // 字符串
      [
        /"""/,
        { token: "string.quote", bracket: "@open", next: "@string_triple" }
      ],
      [
        /"/,
        { token: "string.quote", bracket: "@open", next: "@string_double" }
      ],
      [
        /'/,
        { token: "string.quote", bracket: "@open", next: "@string_single" }
      ],
      [
        /`/,
        { token: "string.quote", bracket: "@open", next: "@string_backtick" }
      ]
    ],
    string_double: [
      [/[^\\"\$]+/, "string"],
      [
        /\$\(/,
        { token: "delimiter.parenthesis", next: "@string_double_expression" }
      ],
      [/\$[\w]+/, "variable"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }]
    ],
    string_single: [
      [/[^\\']+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/'/, { token: "string.quote", bracket: "@close", next: "@pop" }]
    ],
    string_triple: [
      [/[^\\"\$]+/, "string"],
      [
        /\$\(/,
        { token: "delimiter.parenthesis", next: "@string_double_expression" }
      ],
      [/\$[\w]+/, "variable"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"""/, { token: "string.quote", bracket: "@close", next: "@pop" }]
    ],
    string_backtick: [
      [/[^\\`]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/`/, { token: "string.quote", bracket: "@close", next: "@pop" }]
    ],
    string_double_expression: [
      [/[^\\\)]+/, "string"],
      [/\)/, { token: "delimiter.parenthesis", next: "@pop" }]
    ],
    whitespace: [
      [/[ \t\r\n]+/, "white"],
      [/\/\*\*(?!\/)/, "comment.doc", "@javadoc"],
      [/\/\*/, "comment", "@comment"],
      [/\/\/.*$/, "comment"]
    ],
    comment: [
      [/[^\/*]+/, "comment"],
      [/\*\//, "comment", "@pop"],
      [/[\/*]/, "comment"]
    ],
    javadoc: [
      [/[^\/*]+/, "comment.doc"],
      [/\*\//, "comment.doc", "@pop"],
      [/[\/*]/, "comment.doc"]
    ]
  }
};

export { GroovyConfiguration, GroovyLanguage };
