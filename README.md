# Connect to Opensea through Wallet Connect in Unity

## Overview
In this sample, we'll dig into how to list your NFT to Opensea from your game using Openfort's [Web3 Connections API features](https://www.openfort.xyz/docs/reference/api/create-a-web3-connection-object).

Web3Connections allows you to connect your in-game wallet to any application that supports [WalletConnect](https://walletconnect.io) like NFT marketplaces (e.g. [OpenSea](https://opensea.io/)). The magic of this integration is that you don't need any third-party wallet SDK in the Unity client, as Openfort takes care of the wallet creation and connection to the NFT marketplace in a frictionless way. 

We'll be using [PlayFab](https://playfab.com/) as the backend service. PlayFab is a service operated by Microsoft for game developers, offering tools for live game management, all powered by Azure's cloud infrastructure.

By integrating the [Openfort SDK](https://github.com/openfort-xyz/openfort-node) into Azure Functions, we establish a seamless connection to PlayFab. Unity clients using the PlayFab Unity SDK can tap into these functions, accessing the full range of Openfort features within the game environment.

## Application Workflow

![Integration workflow](https://strapi-oube.onrender.com/uploads/playfab_opensea_workflow_img_90127c625b.png?updated_at=2023-11-19T11:06:47.176Z)

## Prerequisites
+ **Setup Openfort**
  + [Add a Contract](https://dashboard.openfort.xyz/assets/new)
    
    This sample requires a contract to run. We use [0x51216BFCf37A1D2002A9F3290fe5037C744a6438](https://sepolia.etherscan.io/address/0x51216bfcf37a1d2002a9f3290fe5037c744a6438) (NFT contract deployed in 11155111 Sepolia). You can use this for the guide:

    ![Alt text](https://strapi-oube.onrender.com/uploads/playfab_opensea_img_2eae75d470.png?updated_at=2023-11-19T11:06:46.685Z)

  + [Add a Policy](https://dashboard.openfort.xyz/policies/new)
    
    We aim to cover gas fees for users. Set a new gas policy:

    ![Alt text](https://strapi-oube.onrender.com/uploads/playfab_opensea_img_1_ecaa326bfe.png?updated_at=2023-11-19T11:06:46.377Z)

    Now, add a rule so our contract uses this policy:

    ![Alt text](https://strapi-oube.onrender.com/uploads/playfab_opensea_img_2_493f681e5a.png?updated_at=2023-11-19T11:06:42.679Z)

+ [**Deploy Azure Functions**](https://github.com/openfort-xyz/playfab-unity-sample#deploy-azure-backend)
+ [**Register Azure Functions in PlayFab**](https://github.com/openfort-xyz/playfab-unity-sample#register-azure-functions) 
+ [**Set up Azure Backend**](https://github.com/openfort-xyz/playfab-unity-sample#set-up-azure-backend)

## Set up Unity Client

This Unity sample project is already equipped with: 
+ [PlayFab Unity SDK](https://github.com/PlayFab/UnitySDK) --> To communicate with `azure-backend`
+ [Openfort Unity SDK](https://github.com/openfort-xyz/openfort-csharp-unity) --> To deserialize `azure-backend` responses

To begin, open [unity-client](https://github.com/openfort-xyz/opensea-walletconnect-unity-sample/tree/main/unity-client) with Unity:

#### Configure PlayFab SDK
  - Navigate to the ***Project*** tab.
  - Search for `PlayFabSharedSettings` and input your PlayFab ***Title ID***:

    <img src="https://strapi-oube.onrender.com/uploads/playfab_opensea_img_28_b6152954d9.png?updated_at=2023-11-19T11:06:42.082Z" width="500">

## Test in Editor
Play the **Login** scene, opt for ***Register***, provide an email and password, and then click **Register***** again. This scene should appear:

![Game Scene](https://strapi-oube.onrender.com/uploads/playfab_opensea_img_32_35f675ded4.png?updated_at=2023-11-19T11:06:40.788Z)

Select ***Mint***. After a brief period, you should see a representation of your newly minted NFT:

![Alt text](https://strapi-oube.onrender.com/uploads/playfab_opensea_wc_img_c37ff864a8.png?updated_at=2023-11-19T11:06:46.185Z)

In the [Openfort Players dashboard](https://dashboard.openfort.xyz/players), a new player entry should be visible. On selecting this player:

![Player Entry](https://strapi-oube.onrender.com/uploads/playfab_opensea_img_34_706b0d267e.png?updated_at=2023-11-19T11:06:46.177Z)

You'll notice that a `mint` transaction has been successfully processed:

![Alt text](https://strapi-oube.onrender.com/uploads/playfab_opensea_img_3_ceeb1a3c2c.png?updated_at=2023-11-19T11:06:46.084Z)

Additionally, by choosing your **Sepolia Account** and viewing ***NFT Transfers***, the transaction is further confirmed:

![Alt text](https://strapi-oube.onrender.com/uploads/playfab_opensea_img_4_97e49a99aa.png?updated_at=2023-11-19T11:06:47.187Z)

In Unity, click on ***List NFTs***:

![Alt text](https://strapi-oube.onrender.com/uploads/playfab_opensea_wc_img_11_c2c16f315f.png?updated_at=2023-11-19T11:06:44.388Z)

Go to [OpenSea](https://testnets.opensea.io/) and choose ***Login***:

![Alt text](https://strapi-oube.onrender.com/uploads/playfab_opensea_wc_img_2_3cf19b42c9.png?updated_at=2023-11-19T11:06:50.106Z)

Then select ***WalletConnect*** and click on the icon to copy the connection URL:

![Alt text](https://strapi-oube.onrender.com/uploads/playfab_opensea_wc_img_3_969f9af3d4.png?updated_at=2023-11-19T11:06:49.287Z)

Back to Unity, paste the URL and choose ***Create***:

![Alt text](https://strapi-oube.onrender.com/uploads/playfab_opensea_wc_img_4_2bfe57096e.png?updated_at=2023-11-19T11:06:43.283Z)

In OpenSea, a welcome panel will pop up. Choose ***Accept and sign***:

![Alt text](https://strapi-oube.onrender.com/uploads/playfab_opensea_wc_img_8_d02e9d1454.png?updated_at=2023-11-19T11:06:49.290Z)

Go to your profile and you will find your NFT. Choose ***List for sale***:

![Alt text](https://strapi-oube.onrender.com/uploads/playfab_opensea_wc_img_5_93bf0669e9.png?updated_at=2023-11-19T11:06:46.882Z)

Set a price and a duration and choose ***Complete listing***:

![Alt text](https://strapi-oube.onrender.com/uploads/playfab_opensea_wc_img_6_cdd7459cf3.png?updated_at=2023-11-19T11:06:46.479Z)

As your first NFT collection, you will need to approve it:

![Alt text](https://strapi-oube.onrender.com/uploads/playfab_opensea_wc_img_12_e6ec74acfb.png?updated_at=2023-11-19T11:06:46.286Z)

Back in Unity, select ***Approve***:

![Alt text](https://strapi-oube.onrender.com/uploads/playfab_opensea_wc_img_14_ef92f6c119.png?updated_at=2023-11-19T11:06:46.581Z)

After a few seconds OpenSea will let you know the collection approval has been successful:

![Alt text](https://strapi-oube.onrender.com/uploads/playfab_opensea_wc_img_9_bfdc1f9ba7.png?updated_at=2023-11-19T11:06:47.082Z)

Now go back to Unity and ***Approve*** the listing:

![Alt text](https://strapi-oube.onrender.com/uploads/playfab_opensea_wc_img_14_ef92f6c119.png?updated_at=2023-11-19T11:06:46.581Z)

Finally, in OpenSea you will see the confirmation of your listing:

![Alt text](https://strapi-oube.onrender.com/uploads/playfab_opensea_wc_img_13_37be18f347.png?updated_at=2023-11-19T11:06:46.579Z)

## Conclusion

Upon completing the above steps, your Unity game will be fully integrated with Openfort and PlayFab, and able to list your NFTs to a marketplace directly from your game. Always remember to test every feature before deploying to guarantee a flawless player experience.

For a deeper understanding of the underlying processes, check out the [tutorial video](https://youtu.be/PHNodBmbEfA). 

## Get support
If you found a bug or want to suggest a new [feature/use case/sample], please [file an issue](../../issues).

If you have questions, or comments, or need help with code, we're here to help:
- on Twitter at https://twitter.com/openfortxyz
- on Discord: https://discord.com/invite/t7x7hwkJF4
- by email: support+youtube@openfort.xyz
