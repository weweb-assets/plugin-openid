# How to configure the OpenID auth plugin

<a href="https://openid.net" target="_blank" class="ww-editor-link">OpenID</a> is a layer on top of the OAuth 2.0 protocol that allows you to authenticate users and get their basic profile from the OAuth provider of your choice, including but not limited to Google, Slack, LINE, etc.

How you configure the OpenID plugin in WeWeb will depend on the OAuth provider you are working with but the logic will remain similar. 

**Pre-requisites**
Before you can configure the WeWeb plugin, you'll need the following information from your OAuth provider:
* the domain WeWeb should send the request to via OpenID
* a client ID
* a client secret

In addition, you can define what scope and response type you want from OpenID or leave the default plugin values.

Learn more about <a href="https://docs.weweb.io/plugins/auth-systems/open-id.html" target="_blank" class="ww-editor-link">working with OpenID in WeWeb</a>.
