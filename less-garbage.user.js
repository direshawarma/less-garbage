// ==UserScript==
// @name        Less Garbage (for Discord)
// @author      Hannah Q.V.
// @namespace   https://github.com/direshawarma/less-garbage
// @description Makes Discord timestamps more readable and useable, makes the inbox larger, removes the "# blocked messages" thing, and removes various nags
// @match       https://discordapp.com/*
// @match       https://discord.com/*
// @updateurl   https://github.com/direshawarma/less-garbage/releases/download/0.3.12-alpha/less-garbage.user.js
// @version     0.3.16
// @grant       GM_addStyle
// @require     https://raw.githubusercontent.com/uzairfarooq/arrive/master/minified/arrive.min.js
// ==/UserScript==


var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var mos = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

GM_addStyle (`
  .timestamp-1E3uAL, .timestampCozy-2hLAPV  { /* Make timestamps more readable */
      font-size: .9em;
      color: #9090A0;
      padding-left: .5em;
  }
  .recentMentionsPopout-3rCiI6 { /* Change inbox size */
    max-height: calc(100vh - 44px);
    max-width: 80vw;
    width:80vw;
  }
  .header-2-Imhb { // Justify the mention/unread buttons right
    justify-content:flex-end; }
    .header-ykumBX { justify-content:flex-end;
  }
  .quickswitcher-35bYg4 { /* Hide quick switcher nag */
    display: none;
  }
  .tutorial-3w5I9h { /* Hide tutorial nag in inbox */
    display:none;
  }
  div.notice-3bPHh-.colorDefault-22HBa0 { /* Hide desktop install nag */
    display:none;
  }
  `);



// look for blocked messages and remove the great grandparent (main container for blocked messages)
document.getElementById("app-mount").arrive(".blockedSystemMessage-2Rk1ek", function() {
  // 'this' refers to the newly created element
  this.parentNode.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode.parentNode); // fuck you is why
});



// look for username headers and change the visible timestamp to be more detailed
document.getElementById("app-mount").arrive(".header-23xsNx", function() {
  // 'this' refers to the newly created element


  var snowflake = this.parentNode.parentNode.id.substr(14); // snowflake is last 14 of id for any given message

  var displayedTime = this.getElementsByClassName("timestamp-3ZCmNB")[0].getElementsByTagName("span")[0]; // get the timestamp text field

  var timestamp = new Date(parseInt(snowflake /4194304 + 1420070400000)); // get leftmost 48 bytes and add unix timestamp for 1/1/2015 00:00.0000

  if (timestamp > (new Date().getTime() - (12*60*60*1000))) { // within the last 12 hours
    displayedTime.innerText = ('00' + timestamp.getHours()).slice(-2); // hours
  }
  else {
    displayedTime.innerText = days[timestamp.getDay()];//weekday
    displayedTime.innerText += ' ' + mos[timestamp.getMonth()];//month
    displayedTime.innerText += ' ' + timestamp.getDate();//day number
    displayedTime.innerText += ', ' + timestamp.getFullYear();//year
    displayedTime.innerText += ' at ' + ('00' + timestamp.getHours()).slice(-2);//hours
  }
  displayedTime.innerText += ':' + ('00' + timestamp.getMinutes()).slice(-2);//minutes
  displayedTime.innerText += ':' + ('00' + timestamp.getSeconds()).slice(-2); //seconds
  //displayedTime.innerText += '.' + ('0000' + timestamp.getMilliseconds()).slice(-4); //milliseconds
});
