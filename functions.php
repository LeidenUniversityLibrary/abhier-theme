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
        wp_enqueue_style( 'mirador-style', get_stylesheet_directory_uri() . '/assets/js/mirador/css/mirador-combined.css', false, null);
        wp_enqueue_style( 'mirador-size', get_stylesheet_directory_uri() . '/mirador-size.css', false, null);
        wp_enqueue_script( 'mirador', get_stylesheet_directory_uri() . '/assets/js/mirador/mirador.js', array ( 'jquery' ), null);
        wp_enqueue_script( 'wp-endpoint', get_stylesheet_directory_uri() . '/assets/js/wordpressEndpoint.js', array('mirador'), null);
        wp_enqueue_script( 'mirador-config', get_stylesheet_directory_uri() . '/assets/js/mirador-config.js', array('mirador', 'wp-endpoint'), null, true);
    }
}
add_action( 'wp_enqueue_scripts', 'abhier_theme_enqueue_styles' );

add_filter( 'wp_nav_menu_items', 'abhier_theme_login_register_link' );

function abhier_theme_login_register_link($menu_items, $args) {
    // add the login or register URL
    $menu_items .= wp_register('<li class="menu-item">', '</li>', false);
    $menu_items .= '<li class="menu-item">'
        . wp_loginout( $_SERVER['REQUEST_URI'], false )
        . '</li>';
    return $menu_items;
}
