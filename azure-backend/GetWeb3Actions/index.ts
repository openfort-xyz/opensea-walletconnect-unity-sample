import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import Openfort from "@openfort/openfort-node";

const openfort = new Openfort(process.env.OF_API_KEY);

function isValidRequestBody(body: any): boolean {
  return body?.CallerEntityProfile?.Lineage?.MasterPlayerAccountId &&
         body?.FunctionArgument?.connectionId;
}

// Function to create a delay
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    context.log("Starting HTTP trigger function processing.");

    if (!isValidRequestBody(req.body)) {
      context.log("Invalid request body received.");
      context.res = { status: 400, body: "Please pass a valid request body" };
      return;
    }

    const connectionId = req.body.FunctionArgument.connectionId;
    let response;
    let attempts = 0;
    const maxAttempts = 5;

    do {
      if (attempts > 0) {
          await delay(500);
      }

      response = await openfort.web3Connections.getWeb3Actions({ id: connectionId });
      attempts++;
    } while ((!response || !response.data || response.data.length === 0) && attempts < maxAttempts);

    if (!response || !response.data || response.data.length === 0) {
        context.res = {
            status: 500,
            body: "Error: No valid content received from Openfort API after multiple attempts."
        };
        return;
    }

    // Process decodedData to ensure it is always a JSON string
    response.data.forEach(action => {
        action.decodedData = JSON.stringify(action.decodedData);
    });

    context.res = { status: 200, body: response };
    context.log("API call was successful, data is valid, and response sent.");
  } catch (error) {
    context.log("Unhandled error occurred:", error);
    context.res = { status: 500, body: JSON.stringify(error) };
  }
};

export default httpTrigger;