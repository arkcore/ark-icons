# ark-icons

Exposes several methods:

```js
var arkIcons = require('ark-icons');
var express = require('express');
var app = express();

// specify manually
var iconPath = arkIcons.iconPath();
var htmlDeclaration= arkIcons.htmlDeclaration('/images', {
    apple: true,
    wp: true,
    android: true
});
app.locals.iconDeclaration = htmlDeclaration;
app.use('/images', express.static(iconPath));
app.use('/images/manifest.json', arkIcons.AndroidManifest('/images'));
app.use('/images/browserconfig.xml', arkIcons.WindowsPhoneConfig('/images'));

// specify automatically, express must be installed!
// opts - optional, same as the ones in htmlDeclaration
arkIcons.init('/images', app, opts);
```

Example layout:

```handlebars
<head>
  ...
  {{{ iconDeclaration }}}
  ...
</head>
<body>
  ...
</body>
```
