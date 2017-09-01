[![Build Status](https://travis-ci.org/Lenddo/node-lenddo.svg?branch=master)](https://travis-ci.org/Lenddo/node-lenddo) [![npm](https://img.shields.io/npm/v/lenddo.svg?style=plastic)](https://www.npmjs.com/package/lenddo) [![npm](https://img.shields.io/npm/l/lenddo.svg?style=plastic)](https://www.npmjs.com/package/lenddo)
# Lenddo Service Client
Please reference the /sample/implementation.js file for an example on how
you can implement the Lenddo REST services.

# Installing the package
Please perform the following command to install Lenddo into your
node.js codebase: `npm install lenddo`

# Sample Usage
All of the following examples assume you you have used the setup defined immediately below. This is used to structure your request to our API.
```javascript
// Configuration - Both of these can be found after logging into the Partners Dashboard.
// If you have difficulty obtaining these please contact your Lenddo account manager.
var id = '{YOUR_API_USER_ID}';
var secret = '{YOUR_API_SECRET}';

// Import clients
var lenddo_clients = require('lenddo').clients;
```

## Submitting Onboarding Priority Data
```javascript
// this is the client ID that you sent us initially.
var client_id = '{YOUR_CLIENT_ID}';
var application_id = '{THE_UNIQUE_APPLICATION_IDENTIFIER}';
var partner_script_id = '{THE_PARTNER_SCRIPT_FOR_THE_APPLICATION_ID}';
var priority_data = '{THE_PARTNER_DATA_AND_VERIFICATION_DATA_TO_USE}';

// begin main script
var AuthorizeService = lenddo_clients.Authorize;
var authorize_client = new AuthorizeService(client_id, client_secret);

```
### PriorityData
```javascript
authorize_client.PriorityData.post(application_id, partner_script_id, priority_data)
    .exec(function(err, result) {
    	if (err) { //there should be no error
    		throw err;
    	} else if (result.response.code !== 200) {
    		throw new Error(result.response.raw); //throw the failed response from AUTHOPRIZE
    	}
      var response = result.response;
      /**
      * the submission should be a success from here
      **/
      console.log(response.data);
    });
```

## Get User Score and Verification
```javascript
// this is the client ID that you sent us initially.
var client_id = '{YOUR_CLIENT_ID}';
var partner_script_id = '{THE_PARTNER_SCRIPT_FOR_YOUR_CLIENT_ID}';

// begin main script
var ScoreService = lenddo_clients.Score;
var client_instance = new ScoreService(id, secret);
```
### Score
```javascript
client_instance.ClientScore.get(client_id, partner_script_id)
    .exec(function(err, result) {
      var response = result.response;
      /**
      * response.data should look like the following:
      * { score: 521, flags: [] }
      **/
      console.log(response.data);
    });
```
### Verification
```javascript
client_instance.ClientVerification.get(client_id, partner_script_id)
    .exec(function(err, result) {
      var response = result.response;
      /**
      * response.data should contain a large object detailing the verification results.
      **/
      console.log(response.data);
    });
```

## Retrieving the MobileData
If you have an implementation with our android SDK and want access to the mobile data stream please use the following API call:
```javascript
// this is the partner script ID you used in the data SDK
var partner_script_id = '{YOUR_PARTNER_SCRIPT_ID}';

var NetworkService = lenddo_clients.Network;
var client_instance = new NetworkService(id, secret);

client_instance.MobileData.get(partner_script_id).exec(function(err, response) {
    /**
    * Here you will see a dump of the data received. Please consult with your Lenddo account manager
    * for documentation regarding the schema that you can expect to see here.
    */
    console.log(response.data);
});
```

## Whitelabel Functionality
If you with to use Lenddo directly with your existing OAuth Access tokens you may submit a user for scoring by using the SDK functions. This method of integration requires that you generate the OAuth tokens with your own Social Network Applications.

To use the whitelabel functionality you **must** use both of the following commands in order. In addition to this you should use the Verification object to take advantage of Lenddos Verification services.

All of the Whitelabel functionality relies on the `Network Service`. You'll need to instantiate the Network Service Client in the following manner:

```javascript
var NetworkService = require('lenddo').clients.Network;
var client_instance = new NetworkService(id, secret);
```

The remainder of the _WhiteLabel_ functionality documentation section will assume you're using `client_instance` as the variable name for your Network Service client, as the above example shows.

### Step 1. Token Submission _(ClientToken.post)_
Tokens must be submitted to Lenddo _before_ submitting the application. Every time you submit an access token, the Lenddo service will return a Profile ID. You may repeat this step for each access token you have, collecting all of the response Profile ID's in the process.

----

At this stage you must have:
* An _Application ID_
* Your _Partner Script ID_
* The Access Token
* The Provider of the access token. This may be any of the following:
    * Facebook
    * LinkedIn
    * Yahoo
    * WindowsLive
    * Google


#### Sample Token Submission Code
```javascript
var profile_ids = [];

client_instance.ClientToken.post(application_id, partner_script_id, provider, token).exec(function (err, data) {
	if (err) {
		// This is only triggered during network connectivity issues
		throw err;
	}
	
	if (data.response.code >= 500) {
		// Something went wrong on Lenddo's side. If this continues, contact Lenddo.
		throw data.response.data;
	}
	
	if (data.response.code >= 400) {
		// This occurs when the request was incorrect
		throw data.response.data;
	}
	
	// The profile ID returned from the Service. This is very important. Save it.
	profile_ids.push( data.response.data.profile_id );
	
	// !!! Begin Step 2 of Whitelabel Integration Here.
});
```

### Step 2. Application Submission _(CommitClientJob.post)_
After you've submitted all of your access tokens you'll need to send the application to Lenddo. At this stage you may optionally take advantage of the provided Lenddo Verification class to provide any additional verification probes.

----
#### Step 2.A. Verification
This step is optional and not necessary if you are not using Lenddo's Verification Service. You must use it otherwise. This SDK exposes a Verification object at `require('lenddo').verification`. You should instantiate this object and record any relevant information to it.

##### Verification Sample Code 
```javascript
var VerificationObject = require('lenddo').verification;

// Get an instance of the verification object
var user_verification = new VerificationObject();
// Define probes to be verified (Everything is optional)
user_verification.set.firstName('John')
                .middleName('J')
                .lastName('Doe')
                .dateOfBirth('YYYY-MM-DD')
                .employer('Lenddo')
                .mobilePhone('555-124-56789')
                .university('University Name')
                .email('user@domain.com');
```
----

The remainder of this section will assume you've created a verification object with the variable name `user_verification`.

#### Sample Application Submission Code
```javascript
client_instance.CommitClientJob.post(application_id, partner_script_id, profile_ids, user_verification)
    .exec(function(err, data) {
    	if (err) {
            // This is only triggered during network connectivity issues
            throw err;
        }
        
        if (data.response.code >= 500) {
            // Something went wrong on Lenddo's side. If this continues, contact Lenddo.
            throw data.response.data;
        }
        
        if (data.response.code >= 400) {
            // This occurs when the request was incorrect
            throw data.response.data;
        }
        
        if (data.response.data.success) {
    		// Application was successfully submitted
        } else {
    		// Application submission failed.
    		throw data.response.data;
        }
    });
```