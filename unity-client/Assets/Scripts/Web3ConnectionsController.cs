using System;
using System.Collections;
using System.Collections.Generic;
using Newtonsoft.Json;
using Openfort.Model;
using PlayFab;
using PlayFab.CloudScriptModels;
using TMPro;
using UnityEngine;

public class Web3ConnectionsController : MonoBehaviour
{
    [Header("UI")]
    public GameObject view;
    public GameObject createPanel;
    public GameObject approvePanel;
    public TMP_InputField urlInput;
    public TextMeshProUGUI statusText;

    private string _connectionId;
    private string _actionId;

    public void Activate()
    {
        //TODO refresh and reject actions
        
        view.SetActive(true);
    }
    
    public void OnConnectBtnClickHandler()
    {
        CreateWeb3Connection(OpenfortController.Instance.GetPlayerId(), 11155111, urlInput.text);    
    }

    public void OnApproveSellBtnClickHandler()
    {
        approvePanel.SetActive(false);
        GetWeb3Actions(_connectionId);
    }

    #region AZURE_FUNCTION_CALLS
    private void CreateWeb3Connection(string playerId, int chainId, string uri)
    {
        createPanel.SetActive(false);
        statusText.text = "Creating Web3 Connection...";

        var request = new ExecuteFunctionRequest
        {
            FunctionName = "CreateWeb3Connection",
            FunctionParameter = new
            {
                playerId,
                chainId,
                uri
            }
        };

        PlayFabCloudScriptAPI.ExecuteFunction(request, OnCreateWeb3ConnectionSuccess, OnCreateWeb3ConnectionError);
    }
    
    private void GetWeb3Actions(string connectionId)
    {
        statusText.text = "Getting Web3 Action...";

        var request = new ExecuteFunctionRequest
        {
            FunctionName = "GetWeb3Actions",
            FunctionParameter = new
            {
                connectionId
            }
        };

        PlayFabCloudScriptAPI.ExecuteFunction(request, OnGetWeb3ActionSuccess, OnGetWeb3ActionError);
    }
    
    private void SubmitWeb3Action(string connectionId, string actionId, bool approve)
    {
        statusText.text = "Submitting Web3 Action...";

        var request = new ExecuteFunctionRequest
        {
            FunctionName = "SubmitWeb3Action",
            FunctionParameter = new
            {
                connectionId,
                actionId,
                approve
            }
        };

        PlayFabCloudScriptAPI.ExecuteFunction(request, OnSubmitWeb3ActionSuccess, OnSubmitWeb3ActionError);
    }
    #endregion

    #region SUCCESS_CALLBACKS
    private void OnCreateWeb3ConnectionSuccess(ExecuteFunctionResult result)
    {
        Debug.Log(result.FunctionResult.ToString());
        _connectionId = result.FunctionResult.ToString();

        GetWeb3Actions(_connectionId);
    }
    
    private void OnGetWeb3ActionSuccess(ExecuteFunctionResult result)
    {
        Debug.Log(result.FunctionResult.ToString());
    
        Web3ActionListResponse web3Actions = JsonConvert.DeserializeObject<Web3ActionListResponse>(result.FunctionResult.ToString());
        
        bool hasPendingActions = false;
    
        foreach (var web3Action in web3Actions.Data)
        {
            if (web3Action.Status == Web3ActionStatusEnum.Pending)
            {
                SubmitWeb3Action(_connectionId, web3Action.Id, true);
                hasPendingActions = true;
                break; // Exit the loop after finding the first pending action
            }
        }
    
        // If there are no pending actions, call GetWeb3Action
        if (!hasPendingActions)
        {
            GetWeb3Actions(_connectionId);
        }
    }
    
    private void OnSubmitWeb3ActionSuccess(ExecuteFunctionResult result)
    {
        Debug.Log(result.FunctionResult);
        statusText.text = "";
        
        approvePanel.SetActive(true);
    }
    #endregion
    
    #region ERROR_CALLBACKS
    private void OnCreateWeb3ConnectionError(PlayFabError error)
    {
        createPanel.SetActive(true);
        Debug.Log(error.ErrorMessage);
    }

    private void OnGetWeb3ActionError(PlayFabError error)
    {
        createPanel.SetActive(true);
        Debug.LogError(error.ErrorMessage);
    }
    
    private void OnSubmitWeb3ActionError(PlayFabError error)
    {
        approvePanel.SetActive(true);
        Debug.Log(error.ErrorMessage);
    }
    #endregion
}
