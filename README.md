# Studio Guinness — Web Portfolio

## 制作状況
納品版（2026-10-26）。全39作品と動画6作品を掲載しています。
追加作品「SUZU & ERI」を初期表示へ追加。6人のMG見本はMEI → SHINO → SUZU → ERI → SANA → LILIの順で連続表示します。

## 実装済み
- ビルド不要のHTML / CSS / JavaScript。画像とサムネイルはローカルassets/。
- 黒・チャコール基調、指定の屋敷カラーとメイド6色のアクセント。
- 動画6作品。サムネイルクリック時のみYouTubeプレーヤーを生成。
- 複数同時再生を避け、別動画の開始時に前のプレーヤーを終了。
- 全39点のアートワーク、初期20点、残り19点の追加表示、5分類の絞り込み。
- クリック・Enterで画像拡大。左右キー・前後ボタンで移動、Home/Endで先頭/末尾、Escで閉じる。
- ライトボックス内でTab / Shift+Tabが循環し、閉じると元の作品へフォーカスが戻る。
- PC・スマホ対応。画像の縦横比保持、遅延読み込み、縮小版と拡大版の使い分け。
- アニメーションを減らす設定に対応。
- 未提供の公式アカウントURLは非表示。YouTube公式チャンネルは動画メタデータから確認済み。

## フォルダ構造

    dist/                  GitHub Pagesで公開するフォルダ
      index.html           ページの文章・構造
      styles.css           スタイルとカラーパレット
      main.js              動画・分類・追加表示・ライトボックス
      data.js              作品、動画、公式リンクの編集データ
      assets/              拡大用WebPとfavicon
        thumbs/            一覧用の軽量WebP
      .nojekyll            Jekyll処理を無効化
    originals/             元画像39点（制作側保管、Git/Web公開・納品ZIP対象外）
    inventory.json         元ファイル名・寸法・容量の対応表
    docs/                  制作側の確認記録（納品ZIPでは最終チェック記録のみ）
    GITHUB_PAGES.md        GitHub Pages公開手順
    README.md              このファイル
    .openai/hosting.json    確認用サイト設定（GitHub Pagesでは不要）

## 作品情報の編集

dist/data.jsのwindow.PORTFOLIOを編集します。ビルドは不要です。

- artworks[].title：公開用タイトル。元画像のファイル名とは独立。
- artworks[].category：key / character / graphic / studies / other。
- artworks[].src：拡大用画像。dist/からの相対パス。
- artworks[].thumbnail：一覧用画像。変更したらthumbnailWidthも実寸に合わせます。
- artworks[].width / height：元画像の寸法。表示の縦横比に使用します。
- artworks[].displayWidth：拡大用WebPの実際の幅。
- artworks[].alt：画像の説明。
- featuredOrder：先に表示する作品IDの順序。残りの作品は自動的に後ろへ並びます。
  MG見本6点はart-34, art-29, art-31, art-25, art-28, art-35の順でひと続きにしてください。この6点の途中へ作品を挿入しないでください。
  新作「SUZU & ERI」はart-39です。
- videos[].title：公開用動画名。nullなら仮題を付けずVIDEO IDで表示。
- videos[].sourceTitle：YouTubeメタデータから取得した正式タイトル。
- videos[].youtubeId：YouTubeの動画ID。
- videos[].poster：assets/内のカバー画像。提供素材から選定しています。
- links[].url：公式URL。nullは非表示。ダミーURLは設定しません。

初期表示点数はmain.jsのlimit=20で指定しています。分類を切り替えると20点へ戻ります。
作品の追加後は画像ファイルもassets/へ置いてください。
公開用タイトルは元ファイル名・画像内表記を参考にしています。
from-PixAI名の三面図は画像内容から説明用タイトルを設定しています。

## カラー

styles.css先頭の:rootにまとまっています。HEXを基準にしています。

| 対象 | HEX | 使用箇所例 |
| --- | --- | --- |
| 屋敷 | #005338 | 選択中フィルター、THE SIX画像下の線 |
| オフ | #F3EBDD | 基本文字 |
| MEI | #EFCB5B | STUDIO GUINNESSのピリオド、フォーカス枠 |
| SHINO | #45234C | ORIGINAL WORLDの小さな印 |
| SUZU | #39843C | THE SIX MAIDSのピリオド |
| ERI | #ef266f | ARTWORKのピリオド |
| SANA | #D3201C | ABOUTの小さなピリオド |
| LILI | #3e8bcb | KEEP EXPLORINGのピリオド |

SUZUは提供RGBの末尾61とHEXの末尾3C（60）が異なるため、指定HEXを採用しました。
THE SIX紹介には6人の色を小さな6点で併記しています。

## 動画情報と確認範囲

未確定3本はYouTube oEmbedから正式タイトルを確認済みです。
取得結果は制作側のdocs/youtube-metadata.jsonに保存しています。

- dwL_KPfxotU：BLITZ OF SIX — THE SIX MAIDS
- 5QB4clhFDeg：THE SIX MAIDS : No.02「LOST & FOUND」｜AI Anime Short Film
- 0FOxR2W_twU：THE SIX MAIDS : No.02「LOST & FOUND」X-EDITION｜AI Anime Short Film

カバー画像は提供されたアートワークを使用し、動画内容のスクリーンショットとは限りません。
YouTubeサムネイルのダウンロードは有効な画像が取得できなかったため採用していません。
ページ初期読み込み時にYouTube iframeはありません。操作後のiframe生成・切替・終了は確認済み。
この検証環境ではYouTubeの実再生まで確認できていません。外部YouTubeリンクも併設しています。

## ローカル確認

dist/index.htmlを直接開いてギャラリーを確認できます。
YouTube再生はfile://では正常なRefererが付かない場合があるため、HTTPSの公開URLから確認してください。

## GitHub Pages公開手順

1. GitHubで新しいリポジトリを作成します。
2. distフォルダの「中身」をリポジトリのルートへアップロードします。index.htmlがルートに来る配置です。
3. Settings → Pages → Build and deploymentでDeploy from a branchを選択します。
4. Branchをmain、フォルダを/(root)に設定してSaveします。
5. GitHubが表示する公開URLでPC・スマホ表示、画像拡大、動画再生を確認します。

画像パスは相対パスなのでusername.github.io/repository/形式に対応します。
originals/や.openai/をGitHub Pagesへアップロードする必要はありません。
詳しい手順と公開後のチェック項目はGITHUB_PAGES.mdをご覧ください。
確認用Sites URLは所有者限定です。応募にはGitHub Pagesで公開した、ログイン不要のURLを使用してください。

## 元画像の保管

提供されたWEB用(1).zipは変更していません。originals/の38点は元ZIPとバイト一致を確認済みです。
確認用サイトのソース容量制限があるため、originals/はGit対象外です。
追加のSUZUERI(1).pngも変更せず保管しています。元画像はお手元の提供ZIP・追加PNGも引き続き保存してください。
納品ZIPには軽量化済みの全画像を含み、容量の大きい元画像は重複収録していません。
表示用WebPは長辺最大1600px・品質85、一覧用は最大800×1000px・品質82で縦横比を保持しています。
