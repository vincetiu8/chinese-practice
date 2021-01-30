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
practice your memorization of the terms in your list! Stats about your practice session are displayed below the
practice card.\
Note: the term-definition pairs are stored in the local browser storage. **If you clear your browser history, all your 
terms will disappear!** If you want to safely clear your history, first download the terms and then reset your history,
so you can copy the terms from the downloaded file back into the application afterwards.

### Editing the queueing algorithm variables
If you want to edit the term queuing algorithm, navigate to the settings page and you can change the different variables
affecting a term's rank. The queueing algorithm consists of assigning each term a 'rank'. Unseen terms are assigned a 
rank of 0, which gets updated to a (negative) value when they are first seen. When you correctly match the term to the
definition, the rank of the term increases by a certain value and when you get a term wrong, the rank will decrease by
a certain value. The system will spit out terms in order of their rank, with lower-ranked terms appearing first.
Finally, after a term is seen it will not be seen again for a minimum number of terms. The customizable variables
include:
- `Lost Points On Fail`: the decrease in a term's rank when an incorrect definition is entered
- `Gained Points On Success`: the increase in a term's rank when a correct definition is entered
- `Starting Points`: the rank a newly seen term will be assigned to
- `Minimum Gap Between Elements`: the minimum number of other terms that will be seen before seeing a term again

In addition to these variables, there are options regarding which way the pairs are quizzed:
- `Flip Terms`: if the term and definition are flipped after successfully entering an answer
- `Ask Term`: if the answer (to the first term if `Flip Terms` is true) should be the term instead of the definition
- `Learned Only Mode`: if you want to only practice terms you have already learned previously (good for testing
  yourself)

Finally, there is a `Daily Goal` option that can be customized to set a daily (and by extension weekly and monthly
goal). This is tracked below the practice area with the cards. If set to 0, this feature is turned off.

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