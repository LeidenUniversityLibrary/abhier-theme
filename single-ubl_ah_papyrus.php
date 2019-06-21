<?php
/**
 * The template for displaying all single posts
 *
 * @link  https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package    abhier-theme
 * @copyright  WebMan Design, Oliver Juhas / Leiden University Libraries, Ben Companjen
 *
 * @since    1.0.0
 * @version  1.4.0
 */





get_header();

	while ( have_posts() ) : the_post();

		/**
		 * copied from the content.php template part
		 */
		do_action( 'tha_entry_before' );

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

	<?php do_action( 'tha_entry_top' ); ?>

	<div class="entry-content"><?php

		do_action( 'tha_entry_content_before' );

			if ( has_excerpt() && ! Modern_Post::is_paged() ) {
				the_excerpt();
			}
			?>
			<p>See more information about <a href="https://www.trismegistos.org/daht/detail.php?tm=<?php echo $post->ubl_ah_tm_id;?>" target="_blank"><?php the_title(); ?>
				in Trismegistos’ Demotic and Hieratic Texts [TM <?php echo $post->ubl_ah_tm_id;?>]</a>.</p>
			<?php
			// Mirador viewer goes between excerpt and the rest of the content.
			do_action( 'ubl_ah_mirador_viewer' );
			$user_token = wp_create_nonce('mirador');
			wp_localize_script( 'mirador-config', 'my_object', array(
				'buildPath' => get_stylesheet_directory_uri() . '/assets/js/mirador/',
				'manifestUri' => $post->ubl_ah_manifest_uri,
				'canvasID' => $post->ubl_ah_canvas_uri,
				'endpointUrl' => rest_url(),
				'token' => $user_token
			));

			the_content( apply_filters( 'wmhook_modern_summary_continue_reading', '' ) );

		do_action( 'tha_entry_content_after' );

	?></div>

	<?php do_action( 'tha_entry_bottom' ); ?>

</article>

<?php

do_action( 'tha_entry_after' );

		// If comments are open or we have at least one comment, load up the comment template.
		if ( comments_open() || get_comments_number() ) {
			comments_template();
		}

	endwhile;

get_footer();
