<?php get_header(); ?>

<main class="topMain c-main">
  <section class="topContents">
    <div class="topContents_wrap">
      <h2 class="topContents_title">トップページ</h2>
      <p class="topContents_text">テキスト</p>
      <a href="<?php echo esc_url( get_home_url() ); ?>/about" class="c-button">会社概要ページへ<span></span></a>
    </div>
  </section>
</main>

<?php get_footer(); ?>