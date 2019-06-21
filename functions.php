<?php
function abhier_theme_enqueue_styles() {

    $parent_style = 'modern-style';

    wp_enqueue_style( $parent_style, get_template_directory_uri() . '/style.css' );
    wp_enqueue_style( 'abhier-style',
        get_stylesheet_directory_uri() . '/style.css',
        array( $parent_style ),
        wp_get_theme()->get('Version')
    );
    // Enqueue Mirador
    if (is_single() && 'ubl_ah_papyrus' == get_post_type()) {
        wp_enqueue_style( 'mirador-style', get_stylesheet_directory_uri() . '/js/mirador/css/mirador-combined.css');
        wp_enqueue_script( 'mirador', get_stylesheet_directory_uri() . '/js/mirador/mirador.js', array ( 'jquery' ));
        wp_enqueue_script( 'mirador-config', get_stylesheet_directory_uri() . '/js/mirador/mirador-config.js', array('mirador'), null, true);
    }
}
add_action( 'wp_enqueue_scripts', 'abhier_theme_enqueue_styles' );
?>