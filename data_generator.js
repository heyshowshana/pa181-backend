const _ = require('underscore');
const axios = require('axios').default;

let emails = ["janedoe@gmail.com", "johnsmith@gmail.com", "rorygilmore@gmail.com", "lukeskywalker@gmail.com",
              "spock@gmail.com", "harrypotter@gmail.com", "bilbobaggins@gmail.com", "bilbobaggins@gmail.com",
              "jamesbond@gmail.com", "sheldoncooper@gmail.com", "edwardcullen@gmail.com", "eleven@gmail.com",
              "percyjackson@gmail.com", "michaelscott@gmail.com", "jackperalta@gmail.com"];

let streets = ["Hoppova", "Sušilova", "Rumiště", "Ludmily Konečné", "Hrnčířská", "Bezručova", "Heinrichova", "Gorkého",
           "Rybkova", "Mahenova", "Jiráskova", "Táborského nábřeží", "Čechyňská", "Bayerova", "Tučkova"];

let district = "Brno-střed";

let notes = ["Ty jo, nejlepší čištení!", "Amazing job guys.", "Could have been better.", "I am a bit dissapointed.",
            "Díky!<3", "Vďaka za vašu prácu!", "Už sa nemôžem dočať ďaľšieho čistenia!", "Pršalo.",
            "Upracete mi aj doma, pls?", "Brno nejlepší město.", "Čo už.", "Better than last time. Thumbs up!"]

let stars = [1, 2, 3, 4, 5]

let times = ["2022-06-10T08:00:00", "2022-09-19T08:00:00", "2022-11-06T08:00:00", "2022-04-13T08:00:00",
             "2022-11-05T08:00:00", "2022-11-05T12:00:00", "2022-06-18T12:00:00", "2022-06-17T12:00:00",
             "2022-06-19T12:00:00", "2022-06-20T08:00:00", "2022-06-21T12:00:00", "2022-06-22T12:00:00"]

/* GENERATING DATA IN user */
for(let i = 0; i < emails.length; i++) {
    axios.post("https://pa181-block-cleaning-server.us-south.cf.appdomain.cloud/user", {
    email: emails[i],
    street: _.sample(streets),
    district: district
})
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });
}

/* GENERATING DATA IN evaluation */
for(let i = 0; i < 100; i++) {
    axios.post("https://pa181-block-cleaning-server.us-south.cf.appdomain.cloud/evaluation", {
        email: _.sample(emails),
        street: _.sample(streets),
        district: district,
        stars: _.sample(stars),
        note: _.sample(notes)
    })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}

/* GENERATING DATA IN cleaning */
for(let i = 0; i < 35; i++) {
    let date = new Date(_.sample(times))
    let date_from = date.toJSON()
    date.setHours(date.getHours() + 3)
    let date_to = date.toJSON()

    axios.post("https://pa181-block-cleaning-server.us-south.cf.appdomain.cloud/cleaning", {
        street: _.sample(streets),
        datetime_from: date_from,
        datetime_to: date_to,
    })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}
