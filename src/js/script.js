jQuery(function($) {
    // ページトップボタンのスムーススクロール
    jQuery('.js-page-top').click(function() {
        jQuery('body,html').animate({
            scrollTop: 0 //ページトップまでスクロール
        }, 300); //ページトップスクロールの速さ。数字が大きいほど遅くなる
        return false; //リンク自体の無効化
    });

    /* スムーススクロール */
    $(function() {
        var headerHeight = $('header').outerHeight(); // ヘッダーについているID、クラス名など、余白を開けたい場合は + 10を追記する。
        var urlHash = location.hash; // ハッシュ値があればページ内スクロール
        if (urlHash) { // 外部リンクからのクリック時
            $('body,html').stop().scrollTop(0); // スクロールを0に戻す
            setTimeout(function() { // ロード時の処理を待ち、時間差でスクロール実行
                var target = $(urlHash);
                var position = target.offset().top - headerHeight;
                $('body,html').stop().animate({ scrollTop: position }, 200); // スクロール速度ミリ秒
            }, 100);
        }
        $('a[href^="#"]').click(function() { // 通常のクリック時
            var href = $(this).attr("href"); // ページ内リンク先を取得
            var target = $(href);
            var position = target.offset().top - headerHeight;
            $('body,html').stop().animate({ scrollTop: position }, 20); // スクロール速度ミリ秒
            return false; // #付与なし、付与したい場合は、true
        });
    });

    /* 電話リンク */
    let ua = navigator.userAgent
    if (ua.indexOf('iPhone') < 0 && ua.indexOf('Android') < 0) {
        jQuery('a[href^="tel:"]')
            .css('cursor', 'default')
            .on('click', function(e) {
                e.preventDefault()
            })
    }

})