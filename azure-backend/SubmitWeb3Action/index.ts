import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import Openfort, { SubmitWeb3ActionRequest } from "@openfort/openfort-node";
import { CreateSubmitWeb3ActionRequest } from "@openfort/openfort-node/dist/models/submitWeb3ActionRequest";

const openfort = new Openfort(process.env.OF_API_KEY);
const OF_SPONSOR_POLICY = process.env.OF_SPONSOR_POLICY;

function isValidRequestBody(body: any): boolean {
  return body?.FunctionArgument?.connectionId && typeof body.FunctionArgument.connectionId === 'string' &&
         body?.FunctionArgument?.actionId && typeof body.FunctionArgument.actionId === 'string' &&
         typeof body?.FunctionArgument?.approve === 'boolean';
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
    const actionId = req.body.FunctionArgument.actionId;  
    const approve = req.body.FunctionArgument.approve;  

    const submitRequest: SubmitWeb3ActionRequest = {
      approve: approve,
      policy: OF_SPONSOR_POLICY
    };

    const createSubmitRequest: CreateSubmitWeb3ActionRequest = {
      web3Action: actionId,
      submitWeb3ActionRequest: submitRequest,
      id: connectionId
    };

    let response;
    try {
      response = await openfort.web3Connections.submitWeb3Action(createSubmitRequest);
    } catch (error) {
      context.log("Error during initial submission: ", error);

      // Attempt rejection submission due to failure in initial submission
      submitRequest.approve = false; // Set approve to false for rejection
      try {
        response = await openfort.web3Connections.submitWeb3Action(createSubmitRequest);
      } catch (rejectionError) {
        context.log("Error during rejection submission: ", rejectionError);
      }
    }

    if (!response) {
      context.res = { status: 204, body: "No content received from Openfort API." };
      return;
    }

    context.res = { status: 200, body: JSON.stringify(response) };
    context.log("API call was successful and response sent.");
  } catch (error) {
    context.log("Unhandled error occurred:", error);
    context.res = { status: 500, body: JSON.stringify(error) };
  }
};

export default httpTrigger;