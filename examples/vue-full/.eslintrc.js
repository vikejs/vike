/*
 * @Descripttion:编码规则
 * @version: v1.0
 * @Author: LiWen
 * @Date: 2022-03-14 19:46:39
 * @LastEditors: LiWen
 * @LastEditTime: 2023-01-13 10:25:02
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: ['standard', 'eslint:recommended', 'plugin:vue/vue3-recommended', 'plugin:@typescript-eslint/recommended', './.eslintrc-auto-import.json'],
  plugins: [
    'html' // eslint-plugin-html插件
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  rules: {
    'no-console': 'off',
    // 在定义对象的时候，getter/setter需要同时出现
    'accessor-pairs': 2,
    // 箭头函数中，在需要的时候，在参数外使用小括号（只有一个参数时，可以不适用括号，其它情况下都需要使用括号）
    'arrow-parens': [2, 'always'],
    // 箭头函数中的箭头前后需要留空格
    'arrow-spacing': [
      2,
      {
        before: true,
        after: true
      }
    ],
    // 该条规则主要用于定义数组字面量定义数组时，前后是否加空格，接受两个可选配置，always 和never .
    // 如果设置为always 那么就应该在在写数组是前后都留空格
    'array-bracket-spacing': [2, 'never'],
    // 如果代码块是单行的时候，代码块内部前后需要留一个空格
    'block-spacing': [2, 'always'],
    // 大括号语法采用『1tbs』,允许单行样式
    'brace-style': [
      2,
      '1tbs',
      {
        allowSingleLine: true
      }
    ],
    /**
     *该规则会搜索代码中所有的下划线，它会忽略变量名开始和结尾的下划线而只检测变量中间的下划线。
     *如果ESLint认为一个变量是常量（所有字母大写），那么在变量名字母之间添加下划线也是可以而不会报错的。
     *该规则只检测生命和定义时的变量而不检测函数调用时的函数名。
     **/
    camelcase: [
      2,
      {
        properties: 'never'
      }
    ],
    // 在定义对象或数组时，最后一项不能加逗号
    'comma-dangle': [2, 'never'],
    // 在写逗号时，逗号前面不需要加空格，而逗号后面需要添加空格
    'comma-spacing': [
      2,
      {
        before: false,
        after: true
      }
    ],
    // 如果逗号可以放在行首或行尾时，那么请放在行尾
    'comma-style': [2, 'last'],
    // 在constructor函数中，如果classes是继承其他class，那么请使用super。否者不使用super
    'constructor-super': 2,
    // 在if-else语句中，如果if或else语句后面是多行，那么必须加大括号。如果是单行就应该省略大括号。
    curly: [2, 'multi-line'],
    // 该规则规定了.应该放置的位置，
    'dot-location': [2, 'property'],
    // 使用=== !== 代替== != .
    eqeqeq: [2, 'allow-null'],
    // 该规则规定了generator函数中星号两边的空白。
    'generator-star-spacing': [
      2,
      {
        before: true,
        after: true
      }
    ],
    // 规定callback 如果有err参数，只能写出err 或者 error .
    'handle-callback-err': [2, '^(err|error)$'],
    // 这个就是关于用什么来缩进了，4个空格=两个tab .
    indent: ['off', 2],
    // keyword 前后需要空格
    'keyword-spacing': [
      2,
      {
        before: true,
        after: true,
        overrides: {}
      }
    ],
    // 该规则规定了在对象字面量语法中，key和value之间的空白，冒号前不要空格，冒号后面需要一个空格
    'key-spacing': [
      2,
      {
        beforeColon: false,
        afterColon: true
      }
    ],
    // 构造函数首字母大写
    'new-cap': [
      2,
      {
        newIsCap: true,
        capIsNew: false
      }
    ],
    // 在使用构造函数时候，函数调用的圆括号不能够省略
    'new-parens': 2,
    // 禁止使用Array构造函数
    'no-array-constructor': 2,
    // 禁止使用arguments.caller和arguments.callee
    'no-caller': 2,
    // 禁止覆盖class命名，也就是说变量名不要和class名重名
    'no-class-assign': 2,
    // 禁止在case/default语句中使用lexical declarations，例如let, const, function and class .因为在case/default中的声明，
    // 在整个switch语句中都能够访问到，如果实在需要声明变量，可以加大括号。
    'no-case-declarations': 2,
    // 在条件语句中不要使用赋值语句
    'no-cond-assign': 2,
    // const申明的变量禁止修改
    'no-const-assign': 2,
    // 在正则表达式中禁止使用控制符（详见官网）
    'no-control-regex': 2,
    // 禁止使用debugger语句
    'no-debugger': 2,
    // 禁止使用delete删除var申明的变量
    'no-delete-var': 2,
    // 函数参数禁止重名
    'no-dupe-args': 2,
    // class中的成员禁止重名
    'no-dupe-class-members': 2,
    // 在对象字面量中，禁止使用重复的key
    'no-dupe-keys': 2,
    // 在switch语句中禁止重复的case
    'no-duplicate-case': 2,
    // 禁止使用不匹配任何字符串的正则表达式
    'no-empty-character-class': 2,
    // 禁止使用eval函数
    'no-eval': 2,
    // 禁止对catch语句中的参数进行赋值
    'no-ex-assign': 2,
    // 禁止扩展原生对象
    'no-extend-native': 2,
    // 禁止在不必要的时候使用bind函数
    'no-extra-bind': 2,
    // 在一个本来就会自动转化为布尔值的上下文中就没必要再使用!! 进行强制转化了。
    'no-extra-boolean-cast': 2,
    // 禁止使用多余的圆括号
    'no-extra-parens': [2, 'functions'],
    // 这条规则，简单来说就是在case语句中尽量加break，避免不必要的fallthrough错误，如果需要fall through，那么看官网。
    'no-fallthrough': 2,
    // 简单来说不要写这样的数字.2 2.。应该写全，2.2 2.0 .
    'no-floating-decimal': 2,
    // 禁止对函数名重新赋值
    'no-func-assign': 2,
    // 禁止使用类eval的函数。
    'no-implied-eval': 2,
    // 消除简写的类型转换，而推荐使用一种更加「自解释」的转换方法
    'no-implicit-coercion': 2,
    // 禁止在代码块中定义函数（下面的规则仅限制函数）
    'no-inner-declarations': [2, 'functions'],
    // RegExp构造函数中禁止使用非法正则语句
    'no-invalid-regexp': 2,
    // 在严格模式下，在classes或者classes-like对象外部使用this关键词this将被视为undefined 并且抛出TypeError错误。
    'no-invalid-this': 2,
    // 禁止使用不规则的空白符
    'no-irregular-whitespace': 2,
    // 禁止使用__iterator__属性
    'no-iterator': 2,
    // label和var申明的变量不能重名
    'no-label-var': 2,
    // 禁止使用label语句
    'no-labels': [
      2,
      {
        allowLoop: false,
        allowSwitch: false
      }
    ],
    // 禁止使用没有必要的嵌套代码块
    'no-lone-blocks': 2,
    // 不要把空格和tab混用
    'no-mixed-spaces-and-tabs': 2,
    // 顾名思义，该规则保证了在逻辑表达式、条件表达式、
    // 申明语句、数组元素、对象属性、sequences、函数参数中不使用超过一个的空白符。
    'no-multi-spaces': 2,
    // 该规则保证了字符串不分两行书写。
    'no-multi-str': 2,
    // 空行不能够超过2行
    'no-multiple-empty-lines': [
      2,
      {
        max: 2
      }
    ],
    // 该规则保证了不重写原生对象。
    'no-native-reassign': 2,
    // 在in操作符左边的操作项不能用! 例如这样写不对的：if ( !a in b) { //dosomething }
    'no-negated-in-lhs': 2,
    // 当我们使用new操作符去调用构造函数时，需要把调用结果赋值给一个变量。
    'no-new': 2,
    // 该规则保证了不使用new Function(); 语句。
    'no-new-func': 2,
    // 不要通过new Object（），来定义对象
    'no-new-object': 2,
    // 禁止把require方法和new操作符一起使用。
    'no-new-require': 2,
    // 当定义字符串、数字、布尔值就不要使用构造函数了，String、Number、Boolean
    'no-new-wrappers': 2,
    // 禁止无意得把全局对象当函数调用了，比如下面写法错误的：Math(), JSON()
    'no-obj-calls': 2,
    // 不要使用八进制的语法。
    'no-octal': 2,
    // 用的少，见官网。http://eslint.org/docs/rules/
    'no-octal-escape': 2,
    // 不要使用__proto__
    'no-proto': 2,
    // 不要重复申明一个变量
    'no-redeclare': 2,
    // 正则表达式中不要使用空格
    'no-regex-spaces': 2,
    // return语句中不要写赋值语句
    'no-return-assign': 2,
    // 不要和自身作比较
    'no-self-compare': 2,
    // 不要使用逗号操作符，详见官网
    'no-sequences': 2,
    // 禁止对一些关键字或者保留字进行赋值操作，比如NaN、Infinity、undefined、eval、arguments等。
    'no-shadow-restricted-names': 2,
    // 函数调用时，圆括号前面不能有空格
    'no-spaced-func': 0,
    // 数名称和调用它的括号之间插入可选的空白
    'func-call-spacing': 0,
    // 禁止使用稀疏数组
    'no-sparse-arrays': 2,
    // 在调用super之前不能使用this对象
    'no-this-before-super': 2,
    // 严格限制了抛出错误的类型，简单来说只能够抛出Error生成的错误。但是这条规则并不能够保证你只能够
    // 抛出Error错误。详细见官网
    'no-throw-literal': 2,
    // 行末禁止加空格
    'no-trailing-spaces': 2,
    // 禁止使用没有定义的变量，除非在／＊global＊／已经申明
    'no-undef': 'off',
    // 禁止把undefined赋值给一个变量
    'no-undef-init': 2,
    // 禁止在不需要分行的时候使用了分行
    'no-unexpected-multiline': 2,
    // 禁止使用没有必要的三元操作符，因为用些三元操作符可以使用其他语句替换
    'no-unneeded-ternary': [
      2,
      {
        defaultAssignment: false
      }
    ],
    // 没有执行不到的代码
    'no-unreachable': 2,
    // 没有定义了没有被使用到的变量
    'no-unused-vars': [
      0,
      {
        vars: 'all',
        args: 'none'
      }
    ],
    // 禁止在不需要使用call（）或者apply（）的时候使用了这两个方法
    'no-useless-call': 2,
    // 不要使用with语句
    'no-with': 2,
    // 在某些场景只能使用一个var来申明变量
    'one-var': [
      2,
      {
        initialized: 'never'
      }
    ],
    // 在进行断行时，操作符应该放在行首还是行尾。并且还可以对某些操作符进行重写。
    'operator-linebreak': [
      2,
      'after',
      {
        overrides: {
          '?': 'before',
          ':': 'before'
        }
      }
    ],
    // 使用单引号
    quotes: [1, 'single', 'avoid-escape'],
    // 在使用parseInt() 方法时，需要传递第二个参数，来帮助解析，告诉方法解析成多少进制。
    radix: 2,
    // 这就是分号党和非分号党关心的了，我们还是选择加分号
    semi: [2, 'always'],
    // 该规则规定了分号前后的空格，具体规定如下。
    'semi-spacing': [
      2,
      {
        before: false,
        after: true
      }
    ],
    // 代码块前面需要加空格
    'space-before-blocks': [2, 'always'],
    // 函数圆括号前面需要加空格
    'space-before-function-paren': [0, 'never'],
    // 圆括号内部不需要加空格
    'space-in-parens': [2, 'never'],
    // 操作符前后需要加空格
    'space-infix-ops': 2,
    // 一元操作符前后是否需要加空格，单词类操作符需要加，而非单词类操作符不用加
    'space-unary-ops': [
      2,
      {
        words: true,
        nonwords: false
      }
    ],
    // 评论符号｀／*｀ ｀／／｀，后面需要留一个空格
    'spaced-comment': [
      2,
      'always',
      {
        markers: ['global', 'globals', 'eslint', 'eslint-disable', '*package', '!', ',']
      }
    ],
    // 推荐使用isNaN方法，而不要直接和NaN作比较
    'use-isnan': 2,
    // 在使用typeof操作符时，作比较的字符串必须是合法字符串eg:'string' 'object'
    'valid-typeof': 2,
    // 立即执行函数需要用圆括号包围
    'wrap-iife': [2, 'any'],
    // yoda条件语句就是字面量应该写在比较操作符的左边，而变量应该写在比较操作符的右边。
    // 而下面的规则要求，变量写在前面，字面量写在右边
    yoda: [2, 'never'],
    'require-yield': 0,
    // react组件文件使用.jsx
    'react/require-extension': 'off',
    // 关闭any验证
    '@typescript-eslint/no-explicit-any': ['off'],
    'no-use-before-define': 0,
    // 是否可以使用空方法
    'no-empty-function': 'off',
    // 是否可以使用空方法
    '@typescript-eslint/no-empty-function': ['off'],
    // 组件命名必须用词组
    'vue/multi-word-component-names': ['off'],
    // 行级属性展示
    'vue/max-attributes-per-line': [
      'error',
      {
        // 一行最多7个属性
        singleline: {
          max: 7
        },
        // 最多3行
        multiline: {
          max: 5
        }
      }
    ],
    'vue/first-attribute-linebreak': ['error', {
      singleline: 'ignore',
      multiline: 'ignore'
    }],
    'vue/html-closing-bracket-newline': [
      'error',
      {
        singleline: 'never',
        multiline: 'never'
      }
    ],
    // 允许是否自闭和
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'always',
          component: 'always'
        },
        svg: 'always',
        math: 'always'
      }
    ],
    'vue/html-indent': ['off'],
    // 强制带v-on
    'vue/v-on-event-hyphenation': ['off'],
    '@typescript-eslint/no-inferrable-types': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    'vue/valid-attribute-name': 'off',
    'vue/component-definition-name-casing': 'off',
    'vue/no-side-effects-in-computed-properties': 'off',
    'no-unmodified-loop-condition': 'off'
  }
};
