$(document).ready(function () {
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).then(function (data) {
    console.log(data);
    console.log("Scraping");

    setTimeout(function(){getArticles();}, 2000);
  })

})


function getArticles() {
  

  $.getJSON("/articles", function (data) {
    console.log(data);
    $("#articles").empty();
    for (var i = 0; i < data.length; i++) {
      $("#articles").append("<p style='background-color:#D8E0BB; border-radius: 10px; padding: 10px;' data-id='" + data[i]._id + "'> <strong>" + data[i].title + "</strong><br />" + data[i].link + "<br>" + data[i].summary + "</p>");
    }
  });
}


$(document).on("click", "p", function () {
  $("#notes").empty();
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .then(function (data) {
      console.log(data);
      $("#notes").append("<h2>" + data.title + "</h2>");
      $("#notes").append("<input id='titleinput' name='title' >");
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
      }
    });
});

$(document).on("click", "#savenote", function () {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    .then(function (data) {
      console.log(data);
      $("#notes").empty();
    });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});
