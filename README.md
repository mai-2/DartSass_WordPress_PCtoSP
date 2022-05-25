# DartSass_WordPress_SPtoPC

## 構成
- WordPressTheme
- src
- gulpfile.js
- package.json
- .gitignore
- index.php

## WordPressThemeは必要に応じて変更してください
- ディレクトリ「WordPressTheme」
- WordPressTheme/style.cssの記述の「WordPressTheme」
- gulpfile.jsの記述の「WordPressTheme」

## JSの記述
- src内のjsフォルダ内で直書きする
- 自動圧縮でassets/jsに吐き出される

## 画像
- src内のimagesフォルダ内で直書きする
- 必要に応じてフォルダを作成してその中にいれる
- 自動圧縮でassets/imagesに吐き出される

## 使い方
- npm i でインストール → node_modulesが生成されればOK
- npx gulp で起動