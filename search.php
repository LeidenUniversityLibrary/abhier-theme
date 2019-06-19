<?php
/**
 * The template for displaying search results pages
 *
 * @link  https://developer.wordpress.org/themes/basics/template-hierarchy/#search-result
 * @uses  `wmhook_modern_title_primary_disable` global hook to disable `#primary` section H1
 *
 * @package    Modern
 * @copyright  WebMan Design, Oliver Juhas
 *
 * @since    1.0.0
 * @version  2.0.0
 */





get_header();

	if ( have_posts() ) :

		if ( ! (bool) apply_filters( 'wmhook_modern_title_primary_disable', false ) ) :

			?>

			<header class="page-header">
				<h1 class="page-title"><?php

					printf(
						/* translators: %s: search query. */
						esc_html__( 'Search Results for: %s', 'modern' ),
						'<span>' . get_search_query() . '</span>'
					);

				?></h1>
			</header>
			<p>Note: these search results do not include annotations of words. To search the contents of papyri,
					please use the <a href="https://lab.library.universiteitleiden.nl/abnormal-hieratic/search.php?q=<?php echo get_search_query(); ?>">contents search interface</a>.</p>

			<?php

		endif;

		get_template_part( 'template-parts/loop/loop', 'search' );

	else :

		get_template_part( 'template-parts/content/content', 'none' );
		?>
		<p>Note: these search results do not include annotations of words. To search the contents of papyri,
					please use the <a href="https://lab.library.universiteitleiden.nl/abnormal-hieratic/search.php?q=<?php echo get_search_query(); ?>">contents search interface</a>.</p>
		<?php
	endif;

get_footer();
