<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,user-scalable=yes" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <link href="<?php echo get_template_directory_uri(); ?>/assets/css/style.css" rel="stylesheet" />
    <?php wp_head(); ?>
  </head>
  <body>
    <header class="c-header">
    <h1 class="c-header_title">共通タイトル</h1>
    <?php if ( is_home() && is_front_page() ) : ?>
      <p class="c-header_subTitle">トップページのみ表示されるタイトル</p>
    <?php else : ?>
      <p class="c-header_subTitle"><?php the_title(); ?></p>
    <?php endif; ?>
  </header>