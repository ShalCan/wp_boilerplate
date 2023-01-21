# 概要

WordPress 制作に特化した gulp テンプレートです。

Docker を使用してローカルで WordPress を起動することも可能です。

## 環境

gulp v4.0.2

node v16.15.0

gulp を起動する前に gulpfile.js の以下の箇所に WordPress テーマ名を入力します。

```
// 出力するWPテーマ名を記入
const themeName = 'test'
```

.gitignore ファイル内の `!test` を上記で設定したテーマ名に書き換えて下さい（記載例通り先端に!をつけます）

```
# テーマ名を「!」付きで記載してください
!test
```

gulpfile.js があるディレクトリに移動し、

`npm install`で必要なパッケージをインストールしておきます。

## gulp 起動コマンド

`npx gulp`

ローカルサーバー http://localhost:3000/ が起動し、ファイルの変更があると自動で以下のコンパイルが行われます。

| 内容                          | 変更フォルダ          | 生成フォルダ                                         |
| ----------------------------- | --------------------- | ---------------------------------------------------- |
| scss ファイルの css 変換      | app/src/sass          | app/product/assets/css と themes/テーマ名/assets/css |
| ejs ファイルの html 変換      | app/src/ejs           | app/product                                          |
| 画像の圧縮                    | app/product/image     | themes/テーマ名/assets/image                         |
| js ファイルのテーマへのコピー | app/product/assets/js | themes/テーマ名/assets/js                            |

※変換後のファイルは自動で上書きされてしまうため直接触らないようにしましょう。

※テーマ用 php ファイルの生成は行なわれません。

### フォルダ構成

| 第１階層 | 第２階層 | 内容                                   |
| -------- | -------- | -------------------------------------- |
| app      | product  | html や css などが入った開発用フォルダ |
|          | src      | ejs や sass のフォルダ                 |
| themes   | テーマ名 | WordPress テーマフォルダ               |

### gulp 単独作業コマンド

`npx gulp sass`：scss ファイル の変換

`npx gulp ejs`：ejs ファイル の変換

`npx gulp imagemin`：画像の圧縮

`npx gulp js`：js ファイルをテーマへコピー

`npx gulp assets`：assets フォルダをテーマへコピー

`npx gulp assetsDel`：テーマの assets フォルダを削除

※不要なファイルが多くなってしまいファイルを全消ししてやり直す場合や、gulp 起動前にファイルを追加してしまったなどで再度コンパイルしたい場合にそれぞれ使用します。

### 動画の圧縮

https://www.videosmaller.com/jp/

動画は非対応なので、無料オンラインサービスで圧縮します

## WordPress の起動

Docker Desktop を起動します。（なければ公式サイトからダウンロードしインストール）

`docker-compose up -d` コマンドでコンテナを起動します。

http://localhost:8000/ へアクセスして WordPress の初期設定を行い、制作したテーマを適応します。

`docker-compose down` で Docker の停止が可能です。

※gulp と docker は同時に起動することができます。

### URL

`http://localhost:8000/` ：トップページ

`http://localhost:8000/wp-admin/` ：管理画面

## その他補足

themes/test フォルダはテスト用テーマなので削除して問題ありません。
