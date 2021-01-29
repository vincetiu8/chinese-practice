# Chinese Practice Application
A small locally-based application that helps memorize chinese terms. Specifically built for the english-chinese
language pair.

## Running the program
In the project directory, you can run:

### `npm start`
Runs the app in the development mode.

### `npm run build`
Builds the app for production to the `build` folder.\
Serve the page with your chosen program (i.e. `serve -s build`)

## Using the program
The front-end works completely fine on its own. You can add, edit and delete terms and use the practice function to
practice your memorization of the terms in your list!\
Note: the term-definition pairs are stored in the local browser storage. **If you clear your browser history, all your 
terms will disappear!**

### Editing the queueing algorithm variables
If you want to edit the term queuing algorithm, navigate to the settings page and you can change the different variables
affecting a term's rank. The queueing algorithm consists of assigning each term a 'rank'. Unseen terms are assigned a 
rank of 0, which gets updated to a (negative) value when they are first seen. When you correctly match the term to the
definition, the rank of the term increases by a certain value and when you get a term wrong, the rank will decrease by
a certain value. The system will spit out terms in order of their rank, with lower-ranked terms appearing first.
Finally, after a term is seen it will not be seen again for a minimum number of terms. The customizable variables
include:
- Lost Points On Fail: the decrease in a term's rank when an incorrect definition is entered
- Gained Points On Success: the increase in a term's rank when a correct definition is entered
- Starting Points: the rank a newly seen term will be assigned to
- Minimum Gap Between Elements: the minimum number of other terms that will be seen before seeing a term again

In addition to these variables, there are two more options regarding which way the pairs are quizzed:
- Flip Terms: if the term and definition are flipped after successfully entering an answer
- Ask Term: if the answer should be the term instead of the definition. Has no effect if Flip Pairs is true

## Linking with [Google Translate](https://translate.google.com/)
This project can (optionally) be linked with the [Google Cloud Translation API](https://cloud.google.com/translate)
To use this service, you will need an 
[API keyfile](https://cloud.google.com/translate/docs/setup#creating_service_accounts_and_keys). Once you have
downloaded your json keyfile, store it in an environment variable under `GOOGLE_APPLICATION_CREDENTIALS` either globally
or in a .env file in the root git directory. This will allow the python flask server to detect your key and use it to
contact google servers. Once this is done, run the `main.py` file (`python main.py`) to launch the local flask server
and access the Google Translate services!\
**Note: make sure the flask server runs on a different port than the front-end!** The flask port is hard-coded to 5000, 
so make sure nothing else is using this port!