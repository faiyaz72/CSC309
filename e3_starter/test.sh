node app.js --status;

node app.js --addRest "Red Lobster" "Seafood at low prices";
node app.js --addRest "Burger King" "King of Burgers";
node app.js --allRest;

node app.js --addResv "Burger King" "Dec 1 2018 21:30:11" 1;
node app.js --addResv  "Red Lobster" "Nov 17 2018 17:15:00" 5;
node app.js --addResv  "Red Lobster" "Nov 17 2018 17:45:00" 4;
node app.js --addResv  "Red Lobster" "Nov 17 2018 17:20:00" 2;
node app.js --addResv  "Red Lobster" "Nov 17 2018 17:30:00" 4;
node app.js --addResv  "Red Lobster" "Dec 1 2018 21:00:00" 3;
node app.js --addResv  "Red Lobster" "Dec 1 2018 22:00:00" 3;
node app.js --addResv  "Red Lobster" "Dec 4 2018 21:00:00" 3;
node app.js --addResv  "Red Lobster" "Dec 4 2018 22:00:00" 3;
node app.js --restInfo "Red Lobster";
node app.js --allResv "Red Lobster";

node app.js --addResv "Burger King" "Dec 1 2018 21:30:11" 1;
node app.js --addResv "Burger King" "Dec 1 2018 22:10:14" 3;
node app.js --addResv "Burger King" "Dec 1 2018 21:40:12" 5;
node app.js --addResv "Burger King" "Dec 1 2018 21:45:13" 1;
node app.js --addResv "Burger King" "Dec 2 2018 21:40:12" 5;
node app.js --addResv "Burger King" "Dec 2 2018 21:45:13" 1;
node app.js --addResv "Burger King" "Dec 4 2018 21:40:12" 5;
node app.js --addResv "Burger King" "Dec 4 2018 21:45:13" 1;
node app.js --restInfo "Burger King";
node app.js --allResv "Burger King";

node app.js --hourResv "Dec 1 2018 21:00:00";
node app.js --status;

node app.js --checkOff "Red Lobster";
node app.js --checkOff "Burger King";
node app.js --checkOff "Burger King";
node app.js --checkOff "Red Lobster";
node app.js --checkOff "Red Lobster";

node app.js --hourResv "Dec 1 2018 21:00:00";
node app.js --allResv "Burger King";
node app.js --allResv "Red Lobster";
node app.js --status;

node app.js --addDelay "Red Lobster" 10;
node app.js --addDelay "Burger King" 30;

node app.js --hourResv "Nov 17 2018 17:00:00";
node app.js --checkOff "Burger King";
node app.js --checkOff "Red Lobster";
node app.js --allResv "Burger King";
node app.js --allResv "Red Lobster";
node app.js --status;

