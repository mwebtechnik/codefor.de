/**
 * Author: gnomjogson
 * Date: 30.09.13
 * Created: 13:29
 **/
(function(window){

    Application.prototype.constructor = Application;
    Application.prototype = {
        speed_add: 55,
        speed_remove: 15,
        delay_before_fadein: 500,
        delay_before_start: 500,
        delay_before_add: 500,
        delay_before_remove: 3000,
        headline : 'Stadt<span class="text__red">&lt;</span>entwickler <span class="text__red">/&gt;</span>*<br>',
        claims: ["nutzen offene Daten um ihre Stadt zu verbessern",
                 "bauen Digitale Werkzeuge für ihre Community",
                 "entwickeln Civic Tech für ihre Stadt"
                ]
    }

    var ref, headline, $container, $subline, index, initialText, $animationWrapper, $header, $beneath, $cookie,
        currentText, currentIndex, currentState, interval, markerText, fadeInSite,
        initialized, minHeight, faq_open, resetting;
    function Application(){
        ref = this;
    };

    Application.prototype.init = function()
    {
        if (!Modernizr.svg) {
            $(".navbar-brand img").attr("src", "img/logo.png");
        }

        $('.cfg-cities li').bind('click', function() {
            $('#mce-ORT').val($(this).html());
        });

        index = 0;
        $container = $('.animated-claim', '.container');
        $subline = $('.cta-sub', '.container');
        $animationWrapper = $('#animation-wrapper','.container');
        headline = ref.headline;
        initialized=false;

        $header = $('.navbar');
        $beneath = $('.beneath-sections')

        minHeight = $container.outerHeight();
        $container.css({minHeight: minHeight});
        $animationWrapper.css({minHeight: $animationWrapper.outerHeight()});

        console.log("$animationWrapper -> " + $animationWrapper.outerHeight());

        initialText = $container.html();

        console.log("initialText -> " + initialText);
        $container.html(headline);

        $container.css('display','none');
        $subline.css('display','none');

        $(window).resize(function() {
            console.log("resize");
            resetting=true;
            clearTimeout(this.id);
            this.id = setTimeout(ref.reset, 200);
        });

        setTimeout(function() {
            $container.fadeIn( 'slow', function(){
                setTimeout(function() {
                    ref.displayClaim();
                }, ref.delay_before_start);
            });
        }, ref.delay_before_fadein);

        //
        // $.removeCookie('cfa_intro_cookie');
        $cookie = $.cookie('cfa_intro_cookie');

        if($cookie){

        } else {
            //no cookie yet
            $.cookie('cfa_intro_cookie', true, { expires: 7 });
            $header.addClass('init-hidden');
            $beneath.addClass('init-hidden');
            fadeInSite=true;
        }


    };

    Application.prototype.reset = function()
    {
        clearInterval(interval);

        $container.css({visibility: 'hidden', minHeight: '', height: ''});
        $container.html(initialText);

        minHeight = $container.outerHeight();
        console.log("reset -> " + minHeight);
        $container.css({minHeight: minHeight, height:minHeight});

        setTimeout(function() {
            resetting=false;
            $container.css('visibility','visible');
            ref.displayClaim();
        }, 250);


    }

    Application.prototype.fadeInSite = function()
    {
        if(fadeInSite){
            $header.removeClass('init-hidden').addClass('fadeInDown');
            $beneath.removeClass('init-hidden').addClass('fadeInUp');
        }
    }

    Application.prototype.displayClaim = function()
    {
        currentText = ref.claims[index].split('');
        currentState = headline;
        currentIndex = 0;

        clearInterval(interval);
        interval = setInterval(ref.addChar,ref.speed_add);
    }

    Application.prototype.addChar = function()
    {
        if(resetting) return;
        var char = currentText[currentIndex];

        if(char){
            currentIndex++;
            $container.html(currentState + char);
            currentState = $container.html();
            if(currentIndex == currentText.length) {
                clearInterval(interval);

                if(!initialized){
                    $subline.fadeIn( 'slow', function(){
                        initialized=true;
                        ref.fadeInSite();
                        setTimeout(function() {
                            ref.removeClaim();
                        }, ref.delay_before_remove);
                    });
                } else {
                    if(!resetting){
                        setTimeout(function() {
                            ref.removeClaim();
                        }, ref.delay_before_remove);
                    }
                }
            }
        }
    }

    Application.prototype.removeClaim = function()
    {
        markerText = "";
        currentState = ref.claims[index];

        clearInterval(interval);
        interval = setInterval(ref.removeChar,ref.speed_remove);
    }

    Application.prototype.removeChar = function()
    {
        if(resetting) return;
        var lastchar = currentState.substr(currentState.length-1);
        var remains = currentState.substr(0,currentState.length-1);

        markerText = lastchar + markerText;
        currentState = remains;

        $container.html(headline + remains + '<span class="marker">' + markerText + '</span>');
        currentIndex--;
        if(currentIndex== 0){
            clearInterval(interval);
            setTimeout(function() {
                if(index < ref.claims.length-1){ index++;} else index = 0;
                ref.displayClaim();
            }, ref.delay_before_add);
        }
    }

    window.Application = Application;

}(window));
