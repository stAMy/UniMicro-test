

(function(){

    var httpRequest;
    var tokenLink = 'http://test-api.unieconomy.no/api/init/sign-in'
    var companyKeyLink = 'http://test-api.unieconomy.no/api/init/companies'
    var testLink = 'http://test-api.unieconomy.no/api/biz/users?action=current-session'
    var contacts = 'http://test-api.unieconomy.no/api/biz/contacts?expand=Info,Info.InvoiceAddress,Info.DefaultPhone,Info.DefaultEmail,Info.DefaultAddress&hateoas=false'
    var contacts2 = "http://test-api.unieconomy.no/api/biz/contacts"
    var contacts3 = "http://test-api.unieconomy.no/api/biz/contacts/"
    var contacts4 = "https://test-api.unieconomy.no/api/biz/contacts/511?expand=Info,Info.InvoiceAddress,Info.DefaultPhone,Info.DefaultEmail,Info.DefaultAddress"
    var access_token;
    var companyKey;
    var contactInfo = [];
    var contact = [];
    //contacts?expand=Info,Info.InvoiceAddress,Info.DefaultPhone,Info.DefaultEmail,Info.DefaultAddress&hateoas=false&top=10
    
    document.getElementById("signIn").onclick = function (){
        requestToken();
        
    };

    document.getElementById("requestKey").onclick = function(){
       
        getCompanyKey();
    }

     document.getElementById("authentication").onclick = function(){
       
        authenticationParameter();
    }

      document.getElementById("contacts").onclick = function(){
       
        getContacts();
        
    }


      document.getElementById("Showcontacts").onclick = function(){
       
        
        showContactInfo();
    }

    document.getElementById("newUser").onclick = function(){
        addContact();
        
    }

     document.getElementById("addNewContact").onclick = function(){
        getNewContactInfo();
        
    }

  

    
/*
// Viser frem alle brukere som er lagt til i listekriteriet ut ifra lenke
// Fremvisning blir vist gjennom en "tabell"
// Oppretter knapper som kan benyttes til å legge til nye brukere og endre eksisterende brukere
*/


    function showContactInfo(){
        
       var container = document.getElementById("table");

          var info = document.createElement("div");
           info.className = "info";

           var tr = document.createElement("tr");
           info.appendChild(tr);

          
          var thName = document.createElement("th");
           thName.innerHTML = "Name";
            tr.appendChild(thName);

           tr.appendChild(thName);
           var thPhone = document.createElement("th");
           thPhone.innerHTML = "Phone";
           tr.appendChild(thPhone);

          var thID = document.createElement("th");
           thID.innerHTML = "ID";
           tr.appendChild(thID);

          var btns = document.createElement("th");
           btns.innerHTML = "Delete/Update";
           tr.appendChild(btns);


       console.log(contactInfo);

       for(var i =0; i < contactInfo.length; i++){
           
           console.log(contactInfo[i]);
           
           var contactObject = {
               name: contactInfo[i].Info.Name,
               phone: contactInfo[i].Info.DefaultPhone.Number,
               ID: contactInfo[i].ID
           
               
           };

           contact.push(contactObject);

           console.log("navn: " + contact[i].name + " , phone: " + contact[i].phone + " , ID: " + contact[i].ID);

           var tr2 = document.createElement("tr");
           info.appendChild(tr2);

         
           var name1 = document.createElement("td");
           name1.className = "name";
           name1.innerHTML = contact[i].name;
           tr2.appendChild(name1);

           var phone = document.createElement("td");
           phone.className = "phone";
           phone.innerHTML = contact[i].phone;
           tr2.appendChild(phone);

        
           var id = document.createElement("td");
           id.className = "id";
           id.innerHTML = contact[i].ID;
           tr2.appendChild(id);

           var deleteButton = document.createElement("BUTTON");
           var text = document.createTextNode("Delete");
           deleteButton.id = contactInfo[i].ID;
           deleteButton.className = "deleteButton";
           deleteButton.appendChild(text);
           tr2.appendChild(deleteButton);

           var editButton = document.createElement("BUTTON");
           var text = document.createTextNode("Edit");
           editButton.id = contactInfo[i].ID;
           editButton.className = "edituser";
           editButton.appendChild(text);
           tr2.appendChild(editButton);

           container.appendChild(info);
           

            
        }

/*
// Går gjennom klassen "edituser" for å finne id ved onclick for de forskjellige knappene som angår "Edit"
*/
            var buttons = document.getElementsByClassName("edituser");
       for(var i = 0; i < buttons.length; i++){
           buttons[i].onclick = function(){
               editContactInfo(this.id);

               console.log(this.id); // sjekker at funksjonen gjør det den skal

               
           };
       }

       var del = document.getElementsByClassName("deleteButton");
       for(var i = 0; i < del.length; i++){
           del[i].onclick = function(){
               
               deleteContact(this.id);
               console.log("ID: "+ this.id + " slettet!");
       }
     }



    } // slutt på showContactInfo()





/*
// Oppretter felt og knapp for å opprette en ny kontakt
*/
    function addContact(){


            document.getElementById('addNewContact').style.display = "block";

            var name = document.createElement("INPUT");
            name.id = "nameID";
            document.body.appendChild(name);

            var phone = document.createElement("INPUT");
            phone.id = "phoneID";
            document.body.appendChild(phone);

            var btn = document.getElementById("addNewContact");

        
    }


/*
// Edite kontakter ved hjelp av input felts
*/

    function editContactInfo(id){

            console.log("Vi editer nå id: " + id);
          document.getElementById('update').style.display = "block";

            var name = document.createElement("INPUT");
            name.id = "editNameID";
            document.body.appendChild(name);

            var phone = document.createElement("INPUT");
            phone.id = "editPhoneID";
            document.body.appendChild(phone);

            var edit = document.getElementById("update");

            edit.onclick = function(){
                 var nameID = document.getElementById("editNameID").value;
                 var phoneID = document.getElementById("editPhoneID").value;
                    console.log(nameID);
                    console.log(phoneID);
                editContact(nameID, phoneID, id);
            }
            
        
            
    }



/*
// Henter dataen fra input felts i addContact og sender de til addNewContact for å provide til database gjennom POST
*/

       function getNewContactInfo(){

        console.log(document.getElementById("nameID").value);
        console.log(document.getElementById("phoneID").value);

        var nameID = document.getElementById("nameID").value;
        var phoneID = document.getElementById("phoneID").value;
        
        
        addNewContact(nameID, phoneID);
       }



/*
// HTTP respons og feilmeldinger
// Hvis responsen kommer fra URL som er satt i tokenLink eller companyKeyLink, så vil disse nøklene bli gitt til variablene
// Lagre kontaktdata i variabel contactInfo
*/

    function alertContents(){
        if(httpRequest.readyState === XMLHttpRequest.DONE){     //betyr request er done
            console.log(httpRequest.responseURL);
            if(httpRequest.status === 200){         // betyr suksessfull return
                alert(httpRequest.responseText);
                if(httpRequest.responseURL === tokenLink){
                    access_token = JSON.parse(httpRequest.response).access_token; // legger token til i variabel
                }else if(httpRequest.responseURL === companyKeyLink){
                    companyKey = JSON.parse(httpRequest.response)[0].Key; // legger key i variabel
                }else if(httpRequest.responseURL === contacts){
                    contactInfo = JSON.parse(httpRequest.response); // legger kontaktdata i variabel
                   
                    //console.log(contactInfo);
                  
                }else if(httpRequest.responseURL === contacts2){
                    console.log(contactInfo);
                }
            }else{
                alert('Det var et problem med requesten'); //feil har skjedd
            }
        }
    }


/*
// Forespørre etter JWT token
*/
    function requestToken(){
        httpRequest = new XMLHttpRequest();

        if(!httpRequest){
            alert('RIP :( Kan ikke opprette en XMLHTTP instants');
            return false;
        }

        httpRequest.onreadystatechange = alertContents;
        httpRequest.open('POST', tokenLink, true);
        httpRequest.setRequestHeader("Content-type", "application/json");
        httpRequest.send(JSON.stringify({
            "UserName" : "bojarlaci",
            "Password" : "Progge4skills*"
        }));
    }

/*
// Forespørre etter "bedriftnøkkel""
*/

    function getCompanyKey(){
        httpRequest = new XMLHttpRequest();

        if(!httpRequest){
            alert('RIP :( Kan ikke opprette en XMLHTTP instants');
            return false;
        }

          httpRequest.onreadystatechange = alertContents;
          httpRequest.open('GET', companyKeyLink, true);
          httpRequest.setRequestHeader("Authorization", 'Bearer ' + access_token);  // Sender token for autentisering
          httpRequest.send(null);
    }


/*
// Forespør om authentication ved bruk av token og companyKey
*/
    function authenticationParameter(){
        httpRequest = new XMLHttpRequest();

        if(!httpRequest){
            alert('RIP :( Kan ikke opprette en XMLHTTP instants');
            return false;
        }

        httpRequest.onreadystatechange = alertContents;
        httpRequest.open("GET", testLink, true);
        httpRequest.setRequestHeader("Authorization", 'Bearer ' + access_token);
        httpRequest.setRequestHeader("CompanyKey", companyKey);
        httpRequest.send(null);
    }








/*
// Forespør om kontaktdata gjennom request til API med authentication
*/

    function getContacts(){
        httpRequest = new XMLHttpRequest();

        if(!httpRequest){
            alert('RIP :( Kan ikke opprette en XMLHTTP instants');
            return false;
        }

        httpRequest.onreadystatechange = alertContents;
        httpRequest.open("GET", contacts, true);
        httpRequest.setRequestHeader("Authorization", 'Bearer ' + access_token);
        httpRequest.setRequestHeader("CompanyKey", companyKey);
        httpRequest.setRequestHeader("Content-type", "application/json");
        httpRequest.send(null);
    }




/*
// Legger til ny kontakt i databasen med parametre navn og tlf sendt fra inputs
*/

      function addNewContact(nameID, phoneID){
        httpRequest = new XMLHttpRequest();

        if(!httpRequest){
            alert('RIP :( Kan ikke opprette en XMLHTTP instants');
            return false;
        }

        httpRequest.onreadystatechange = alertContents;
        httpRequest.open("POST", contacts2, true);
        httpRequest.setRequestHeader("Authorization", 'Bearer ' + access_token);
        httpRequest.setRequestHeader("CompanyKey", companyKey);
        httpRequest.setRequestHeader("Content-type", "application/json");
        httpRequest.send(JSON.stringify({

  "Info": {
    "Name": nameID,
    "InvoiceAddress": {
        "AddressLine1": "Andebygaten 33b",
        "AddressLine2": "2 etg.",
        "AddressLine3": "",
        "City": "Andeby",
        "Country": "DisneyWorld",
        "CountryCode": "DW",
        "PostalCode": "341234-A",
      },
    "DefaultPhone": {
        "CountryCode": "+999",
        "Description": "Mobile",
        "Number": phoneID,
      },
    "DefaultEmail": {
        "EmailAddress": "mikke@mus.com",
      }
  },
  "Comment": "Her har vi en splitter ny kontaktperson"

	}));

    }



/*
// Sletter kontakt i databasen
*/
       function deleteContact(id){

           console.log(id);

        httpRequest = new XMLHttpRequest();
        console.log("info nå sendt");

        if(!httpRequest){
            alert('RIP :( Kan ikke opprette en XMLHTTP instants');
            return false;
        }

        httpRequest.onreadystatechange = alertContents;
        httpRequest.open("DELETE", contacts3 + id, true);
        httpRequest.setRequestHeader("Authorization", 'Bearer ' + access_token);
        httpRequest.setRequestHeader("CompanyKey", companyKey);
        httpRequest.setRequestHeader("Content-type", "application/json");
        httpRequest.send(null);

       
    }




/*
// Redigerer kontakt ved å sende data fra parameter via PUT metode. Har også console.log på  de for å sjekke at de faktisk er kommet frem
*/


function editContact(nameID, phoneID, id){
    console.log(id);
    console.log(phoneID);
    console.log(nameID);
    

    httpRequest = new XMLHttpRequest();
    console.log("info nå sendt");

        if(!httpRequest){
            alert('RIP :( Kan ikke opprette en XMLHTTP instants');
            return false;
        }

        httpRequest.onreadystatechange = alertContents;
        httpRequest.open("PUT", "https://test-api.unieconomy.no/api/biz/contacts/" + id + "?expand=Info,Info.InvoiceAddress,Info.DefaultPhone,Info.DefaultEmail,Info.DefaultAddress", true);
        httpRequest.setRequestHeader("Authorization", 'Bearer ' + access_token);
        httpRequest.setRequestHeader("CompanyKey", companyKey);
        httpRequest.setRequestHeader("Content-type", "application/json");
        httpRequest.send(JSON.stringify({
            

  "CustomValues": {},
  "Comment": "Denne er editert av Jon Terje, 13.04.2017 kl. 17:30",
  "CreatedAt": "2017-04-13T11:09:56.053Z",
  "CreatedBy": "a5c80856-2fb7-405c-ad49-08c4162732dd",
  "Deleted": false,
  "ID": id,
  "InfoID": 513,
  "ParentBusinessRelationID": null,
  "Role": null,
  "StatusCode": null,
  "UpdatedAt": null,
  "UpdatedBy": null,
  "Info": {
    "CustomValues": {},
    "CreatedAt": "2017-04-13T11:09:56.04Z",
    "CreatedBy": "a5c80856-2fb7-405c-ad49-08c4162732dd",
    "DefaultBankAccountID": null,
    "DefaultContactID": null,
    "DefaultEmailID": 509,
    "DefaultPhoneID": 6,
    "Deleted": false,
    "ID": 513,
    "InvoiceAddressID": 1016,
    "Name": nameID,
    "ShippingAddressID": null,
    "StatusCode": null,
    "UpdatedAt": null,
    "UpdatedBy": null,
    "DefaultPhone": {
      "CustomValues": {},
      "BusinessRelationID": 513,
      "CountryCode": "+999",
      "CreatedAt": "2017-04-13T11:09:56.023Z",
      "CreatedBy": "a5c80856-2fb7-405c-ad49-08c4162732dd",
      "Deleted": false,
      "Description": "Mobile",
      "ID": id,
      "Number": phoneID,
      "StatusCode": null,
      "Type": "0",
      "UpdatedAt": null,
      "UpdatedBy": null
    },
    "DefaultEmail": {
      "CustomValues": {},
      "BusinessRelationID": 513,
      "CreatedAt": "2017-04-13T11:09:56.04Z",
      "CreatedBy": "a5c80856-2fb7-405c-ad49-08c4162732dd",
      "Deleted": false,
      "Description": null,
      "EmailAddress": "mikke@mus.com",
      "ID": 509,
      "StatusCode": null,
      "Type": null,
      "UpdatedAt": null,
      "UpdatedBy": null
    },
    "InvoiceAddress": {
      "CustomValues": {},
      "AddressLine1": "Andebygaten 37b",
      "AddressLine2": "2 etg.",
      "AddressLine3": "",
      "BusinessRelationID": 513,
      "City": "Andeby",
      "Country": "DisneyWorld",
      "CountryCode": "DW",
      "CreatedAt": "2017-04-13T11:09:55.977Z",
      "CreatedBy": "a5c80856-2fb7-405c-ad49-08c4162732dd",
      "Deleted": false,
      "ID": 1016,
      "PostalCode": "341234-A",
      "Region": null,
      "StatusCode": null,
      "UpdatedAt": null,
      "UpdatedBy": null,
      "_links": {
        "actions": {},
        "relations": {},
        "transitions": {}
      }
    },
    "_links": {
      "actions": {},
      "relations": {
        "Self": {
          "href": "/api/biz/business-relations/513",
          "method": "GET",
          "label": null,
          "description": null,
          "readonly": false
        },
        "Contacts": {
          "href": "/api/biz/contacts?filter=ParentBusinessRelationID eq 513",
          "method": "GET",
          "label": null,
          "description": null,
          "readonly": false
        },
        "BankAccounts": {
          "href": "/api/biz/bankaccounts?filter=BusinessRelationID eq 513",
          "method": "GET",
          "label": null,
          "description": null,
          "readonly": false
        }
      },
      "transitions": {}
    }
  },
  "_links": {
    "actions": {},
    "relations": {
      "Self": {
        "href": "/api/biz/contacts/511",
        "method": "GET",
        "label": null,
        "description": null,
        "readonly": false
      },
      "Info": {
        "href": "/api/biz/business-relations/513",
        "method": "GET",
        "label": null,
        "description": null,
        "readonly": false
      }
    },
    "transitions": {}
  }


        }));


}



})(); //slutt på hele filen


 