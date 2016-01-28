$(function(){


  var $body = $('body');


  reHeightMainContainer();
  $(window).on('resize', reHeightMainContainer);


  // To update the opportunities counter
  // -----------------------------------------------------------------------------
  var $opportunitiesCounter = $('#opportunities-counter'); // put this class to any element where you want to have the counter
  if( $body.find($opportunitiesCounter).length > 0 ){
    // TODO remove this hard-coded url
    var promise = $.getJSON('https://seguros.comparamejor.com/opportunities/counter/');

    promise.done(function(data){
      // Add the thousand dot
      var formatted = parseInt(data['number_of_opportunities']).format(0, '.');
      var html = '';
      // format the number with the proper markup
      formatted.chars(function(char){
        if( char != '.' ){
          html += '<span>{char}</span>'.assign({ char: char });
        } else {
          html += char;
        }
      });
      $opportunitiesCounter.html(html);
    });
  }

  // @section: Below the fold tabs
  // -----------------------------------------------------------------------------
  var $contentFromBlog = $('section#content-from-blog');

  if( $body.find($contentFromBlog).length > 0 || $body.hasClass('page-template-page-help-php') ){
    $('ul.nav-tabs-memorable > li > a').on('shown.bs.tab', function(event){
      var id = $(event.target).attr('href').substr(1);
      window.location.hash = 'tab-' + id;
    });

    // On load of the page switch to the currently selected tab
    var hash = window.location.hash.replace('tab-', '');
    $('a[href="' + hash + '"]').tab('show');
  }


  // @section: Below the fold pagination
  // -----------------------------------------------------------------------------
  if( $body.find($contentFromBlog).length > 0 ){
    $contentFromBlog.find('section').each(function(){
      var $thisSection = $(this);

      // Wrap content inside a tab-content to have proper bootstrap markup
      var $sectionWrapper = $('<div/>', {
        class: 'tab-content'
      });
      $thisSection.wrapInner($sectionWrapper);

      // Basic bootstrap pagination markup as jQuery object
      var $paginationHtml = $('<div class="pagination block clearfix"><div class="clearfix pull-right"><nav></nav></div></div>');

      var $pagesInThisSection = $thisSection.find('div[id*="page"]');

      if( $pagesInThisSection.length > 1 ){
        $pagesInThisSection.each(function(index){
          var $thisPage = $(this);

          $thisPage.attr('id', function(){
            return $thisSection.attr('id') + '-' + $thisPage.attr('id');
          });

          // Add bootstrap tabs class names
          $thisPage.addClass('tab-pane fade');
          if( index == 0 ){
            $thisPage.addClass('in active'); // required in order to have bootstrap fade effect
          }

          // Append the pagination links
          if( index == 0 ){
            $paginationHtml.find('nav').append('<a href="javascript:void(0)" class="arrow previous"><i class="fa fa-caret-left"></i></a> ');
          }

          $paginationHtml.find('nav').append('<a href="{href}" data-toggle="tab">{page}</a>'.assign({
            href: '#' + $thisPage.attr('id'),
            page: index + 1
          }));

          if( index + 1 == $pagesInThisSection.length ){
            $paginationHtml.find('nav').append('<a href="javascript:void(0)" class="arrow next"><i class="fa fa-caret-right"></i></a> ');
          }
        });

        $thisSection.append($paginationHtml);

        $thisSection.find('a[data-toggle="tab"]').each(function(index){
          $(this).on('click', function(event){
            event.preventDefault();
            $(this).tab('show');
          });

          $(this).on('shown.bs.tab', function(event){
            $thisSection.find('a[data-toggle="tab"].active').removeClass('active');
            $(event.target).addClass('active');
          });

          // Show the first tab
          if( index == 0 ){
            $(this).tab('show');
          }
        });

        // Next and previous buttons
        $thisSection.on('click', 'a.arrow', function(event){
          var $this = $(this);

          if( $this.hasClass('next') ){
            $thisSection.find('a[data-toggle="tab"].active').next().tab('show');
          } else {
            $thisSection.find('a[data-toggle="tab"].active').prev().tab('show');
          }
        });
      }
    });
  }

});

var reHeightMainContainer = function(){
  var $header = $('header#comparamejor-main-header'),
    $footer = $('footer#comparamejor-main-footer'),
    $mainContainer = $('main');

  $mainContainer.css({
    "min-height": function(){
      return $(window).height() - ( $footer.outerHeight() + $header.outerHeight() ) - 103; // 103px hand-calculated
    }
  });
};