# GitHub Pages 公開手順

このサイトはHTML / CSS / JavaScriptのみで動きます。ビルドやパッケージのインストールは不要です。

## 1. 公開するファイルを準備

納品ZIPを展開し、`dist/`を開きます。アップロードするのは**distフォルダの中身**です。
`index.html`、`styles.css`、`main.js`、`data.js`、`assets/`、`.nojekyll`を同じ階層に置きます。
`.nojekyll`は空のファイルです。隠しファイルが見えない場合はGitHubで同名ファイルを作成してください。

## 2. GitHubへアップロード

1. GitHubで公開用のリポジトリを作成します。GitHub Freeの場合はPublicを選択します。
2. 「Add file → Upload files」から、上記ファイルとassetsフォルダをアップロードしてコミットします。
3. リポジトリ直下にindex.htmlがあること、assets/thumbs/も含まれることを確認します。

元画像ZIP、追加PNG、制作側のoriginals/、.openai/は公開に不要です。

## 3. Pagesを有効化

1. リポジトリの「Settings → Pages」を開きます。
2. 「Build and deployment → Source」で「Deploy from a branch」を選びます。
3. Branchを「main」、フォルダを「/(root)」にして「Save」を押します。
4. 公開完了後、Pages設定に表示されたURLを開きます。公開処理の状況はActionsでも確認できます。

公開元の設定については[GitHub公式手順](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)を参照してください（2026-10-26確認）。

## 4. 応募前の確認

- ログアウト状態やプライベートブラウズでもURLが開ける。
- PC・スマホで画像が表示され、全39点への追加表示と拡大操作ができる。
- MG見本がMEI → SHINO → SUZU → ERI → SANA → LILIの順に続いている。
- YouTubeの6作品が再生できる。制作環境ではプレーヤーの生成・切替まで確認済みですが、実際の映像再生は未確認です。
- URL末尾や画像のファイル名を変えていない。大文字・小文字の違いにも注意してください。

この確認用Sitesページは所有者限定です。応募には**GitHub Pagesで公開したログイン不要のURL**を使用してください。

## 更新方法

作品のタイトル・分類・画像パス・動画ID・公式リンクはdata.js、文章はindex.html、色やレイアウトはstyles.cssで変更します。
編集したファイルを同じ場所へアップロードしてコミットすると、公開元に反映されます。作品追加の詳しい項目はREADME.mdをご覧ください。

## 表示できないとき

- トップが404：公開元がmain / (root)か、そこにindex.htmlがあるかを確認します。
- 画像だけ表示されない：assets/とassets/thumbs/のアップロード漏れ、data.jsのパス、ファイル名の大小文字を確認します。
- 更新が見えない：Actionsで反映完了を確認してから再読み込みします。
- 動画が埋め込みで再生できない：作品横の「YouTubeで見る」で開き、動画側の公開・埋め込み設定を確認します。
