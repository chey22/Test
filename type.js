$(document).ready(function () {

    //a Proverbs 31 woman
    let sentences = [
    'A wife of noble character who can find? She is worth far more than rubies.',
    'She is clothed with dignity and strength; she can laugh at the days to come.',
    'She speaks with wisdom, and faithful instruction is on her tongue.',
    'She watches over the affairs of her household and does not eat the bread of idleness.',
    'Her children arise and call her blessed; her husband also, and he praises her.'];
    let sentencesIndex = 0;
    let letterIndex = 0;
    let currentSentence = sentences[sentencesIndex];
    let currentLetter = currentSentence[letterIndex];
    const words = 71
    let mistakes = 0;
    let start = 0
    let end = 0
    let wpm = 0
    let minutes = 0
    $('#sentence').remove();
    $('body').prepend('<div class="end-class" id="sentence"></div>')    

    //displays the first sentence and first letter of that sentence
    $('#sentence').text(currentSentence);
    $('#target-letter').text(currentLetter);
    //step 2 - only display lowercase keyboard
    $('#keyboard-upper-container').hide()

    highlight_sentence = currentSentence.highlightAt(letterIndex)
    $('#sentence').html(highlight_sentence);

    //step 3a - when the shift key is pressed, display the uppercase keyboard and hide the lowercase
    $(document).keydown(function (e) {
        if (event.which == 16) {
            $('#keyboard-upper-container').show();
            $('#keyboard-lower-container').hide();
        }
    })

    $(document).keyup(function (e) {
        //step 3b - when the shift key is released, display the lowercase keyboard and hide the uppercase
        if (e.which == 16) {
            $('#keyboard-upper-container').hide();
            $('#keyboard-lower-container').show();
        }
        //when a key is released, the bground color changes back to original color
        $('.highlight').removeClass('highlight');
    });

    //step 4 - keypress ignores keys like shift, etc so that you can capitalize letters
    $(document).keypress(function (e) {
        //.which displays the ASCII code of the letter key that was pressed
        //highlight the key that was pressed
        $('#' + e.which).addClass('highlight');
        
        //starts the timer
        if (start == 0) {
            start = new Date();
        }
        
        if (currentSentence.charCodeAt(letterIndex) == e.which) {
            $('#feedback').append('<span class="glyphicon glyphicon-ok"></span>');
            letterIndex++;
            //instead of moving #yellow-block across the screen incrementally, this is a much more accurate way to highlight each letter as the game progresses. See last line of code
            highlight_sentence = currentSentence.highlightAt(letterIndex)
            $('#sentence').html(highlight_sentence);
        } else {
            $('#feedback').append('<span class="glyphicon glyphicon-remove"></span>');
            mistakes++
        }
        
        //step 7 - display the currently expected letter in the target
        currentLetter = currentSentence[letterIndex];
        $('#target-letter').text(currentLetter);

        //step 5 - sentences array (5 values) displayed at top of page, but only cycles through one sentence at a time.
        if (letterIndex < currentSentence.length) {
            letterIndex + 1
        } else {
            if (sentencesIndex < 4) {
                sentencesIndex++
                currentSentence = sentences[sentencesIndex]
                $('#sentence').text(currentSentence)
                letterIndex = 0
                $('#target-letter').text(currentSentence[letterIndex]);
                $('#feedback').empty();
                highlight_sentence = currentSentence.highlightAt(letterIndex)
                $('#sentence').html(highlight_sentence);
            } else {
                // when the last key of the index is pressed, this ends the timer and therefore the game and also empties the feedback icons and target letter
                if (end == 0) {
                    end = new Date();
                    minutes = (end - start) / 60000
                    wpm = words / minutes - 2 * mistakes
                    $('#feedback').empty();
                    $('#target-letter').empty()
                }

                //grammar
                if (mistakes !== 1) {
                    $('#sentence').text('You ran out of sentences! Your typing speed was ' + wpm.toFixed(0) + ' words per minute with ' + mistakes + ' mistakes!')
                } else {
                    $('#sentence').text('You ran out of sentences! Your typing speed was ' + wpm.toFixed(0) + ' words per minute with ' + mistakes + ' mistake!')
                }

                $('#target-letter').append('<button class=playAgain>Play Again</button>')
                $('.playAgain').slideUp(300).delay(1000).fadeIn(2000);
                $('.playAgain').click(function () {
                    location.reload(true)
                });
            };
        }
    });
});

//instead of moving #yellow-block across the screen incrementally, this is a much more accurate way to highlight each letter as the game progresses
String.prototype.highlightAt = function(index) {
    return this.substr(0,index) + '<span class="highlight2">' + this.substr(index,1) +'</span>' + this.substr(index+1);
}
