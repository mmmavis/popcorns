const ANIMATION_DELAY = 0; // in ms
const MESSAGES_FROM_EXPORTED_JSON = true;

/*
const FIREBASE_DB_PATH = `/notes`;

// Initialize Firebase
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyA0XSAtrdlzS5xtE2k7Ln5EYznTd0dYQIc",
  authDomain: "aurelia-popcorns.firebaseapp.com",
  databaseURL: "https://aurelia-popcorns.firebaseio.com",
  projectId: "aurelia-popcorns",
  storageBucket: "aurelia-popcorns.appspot.com"
};

firebase.initializeApp(FIREBASE_CONFIG);

firebase.auth().signInAnonymously().catch(function(error) {
  console.log("error", error);
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    // var isAnonymous = user.isAnonymous;
    // var uid = user.uid;
    // console.log("user");

    renderAllNotes(function() {
      setTimeout(function() {
        $("#inner-wrapper").append(createHTML({},"new-note-template"));
      }, ANIMATION_DELAY);
    });
  } else {
    // User is signed out.
    // console.log("out");
  }
});

*/

renderAllNotes(function() {
  setTimeout(function() {
    $("#inner-wrapper").append(createHTML({},"new-note-template"));
  }, ANIMATION_DELAY);
});

Handlebars.registerHelper("localTime", function(timestamp) {
  return moment.unix(timestamp/1000).format("YYYY-MM-DD hh:mm a");
});

function renderAllNotes(done) {
  // firebase.database().ref(FIREBASE_DB_PATH).once('value').then(function(snapshot) {
  //   var notes = snapshot.val();
  $.getJSON("data.json", function(notes) {
    if (MESSAGES_FROM_EXPORTED_JSON) {
      notes = notes.notes;
    }
    console.log(notes);

    var numNotes = Object.keys(notes).length;
    var currIndex = 0;

    if (numNotes === 0) {
      done();
    }

    function renderNotesWithDelay() {
      var key = Object.keys(notes)[currIndex];
      var currentNote = notes[key];

      currentNote.id = key;
      renderNote(currentNote);

      currIndex += 1;
      if (currIndex <= numNotes-1) {
        setTimeout(renderNotesWithDelay, ANIMATION_DELAY);
      } else {
        done();
      }
    }

    renderNotesWithDelay();
  });
}

function createHTML(data, templateId) {
  var source = document.getElementById(templateId).innerHTML;
  var template = Handlebars.compile(source);

  return template(data);
}

function getFileExtensionFromLink(url) {
  var extension = url.split('.').pop().split(/\#|\?/g)[0];
  var mediaType = "webpage";

  switch (extension.toLowerCase()) {
    case "":
      mediaType = false;
      break;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      mediaType = "image"
      break;
    case "mp4":
    case "avi":
    case "mpg":
      mediaType = "video";
    }

  return {
    extension: extension,
    mediaType: mediaType
  };
}

function isSrcVideo(filename = "") {
  var ext = filename.split("?")[0].split(".").pop();

  switch (ext.toLowerCase()) {
    case "mp4":
    case "avi":
    case "mpg":
      return true;
    }

  return false;
}

function renderNote(note) {
  switch (getFileExtensionFromLink(note.imgSrc).mediaType) {
    case "video":
      note.imgSrcIsVideo = true;
      break;
    case "webpage":
      note.imgSrcIsWebpage = true;
  }

  var rotateDeg = Math.floor(Math.random() * 360);
  var scale = (Math.floor(Math.random() * 100) + 70) / 100;

  var kernelStyle = [
    "position: relative",
    "transform: rotate(" + rotateDeg +"deg) " + "scale(" + scale +") "
  ];

  note.kernelStyle = kernelStyle.join(";") + ";";

  $("#inner-wrapper").append(createHTML(note,"note-template"));
}

// send new note
// $("body").on("submit", "#new-note-form", function(event) {
//   event.preventDefault();

//   var ref = firebase.database().ref(FIREBASE_DB_PATH).push();
//   var task = ref.set({
//     timestamp: Date.now().toString(),
//     message: $(this).find("[name=message]").val().replace(/\n/g,"<br>"),
//     submitter: $(this).find("[name=submitter]").val(),
//     imgSrc: $(this).find("[name=imgSrc]").val(),
//     textColor: null
//   }, function complete() {
//       // reload page so new notes shows... a cheat...
//       window.location.reload(true);
//       done();
//     }
//   );
// });

$("body").on("change", "#new-note-form input[type=radio][name=bgColor]", function(event) {
  $.each($("input[type=radio][name=bgColor]"), function(index, option) {
    $("#new-note").removeClass(option.value);
  });

  $("#new-note").addClass(this.value);
});

$("body").on("click", ".note .kernel", function() {
  $(this).parent(".note").addClass("popped");
});

$("#pop-all").on("click", function() {
  $(".kernel").each(function( index, element ){
    var $k = $(this);
    $k.addClass("shake-constant");

    setTimeout(function() {
      $k.removeClass("shake-constant");
      $k.parent(".note").addClass("popped");
    }, 500);
  });

  $(this).hide();
});
