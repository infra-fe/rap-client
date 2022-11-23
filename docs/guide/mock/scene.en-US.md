## Mock Scene
In the front-end development stage, for the same interface, developers hope to return different response content according to changing request parameters, instead of frequently changing the configuration or creating different interfaces

- Click the scene setting button on the interface to create or edit the corresponding scene in the pop-up window
<code src="./component/button.tsx" inline=true></code>

- The scene is called by explicitly passing in the __scene parameter. The parameter value is the scene key, which is automatically generated when the scene is created, and can also be edited and changed. The scene key under the same interface cannot be repeated; [Scene Key] The current default value is ID, users can name a meaningful string according to their needs
<code src="./component/create.tsx" inline=true></code>
<code src="./component/scene_key.tsx" inline=true></code>

- The response content is set by writing json. If the json format does not match, an error will be reported when formatting or saving;

<code src="./component/json.tsx" inline=true></code>
<code src="./component/data.tsx" inline=true></code>