# First View

# RAP
Before you starting to use RAP, let's familiar with RAP's website, which will give you a quick understanding of RAP.

### Login
Fist, login with google account。

<code src="./component/login.tsx" inline=true></code>
### Home
After login, you will enter the home page。

1 On the top left of the page, there is navigation, you can see the `repository`, `organization` link button

2 On the top right of the page, there is `language` button, and user account management button

3 On the middle right of page, there are repositories which are your owned or joined

4 On the middle left of page, there are recent activities, you will quickly scan the history of repositories

<code src="./component/home.tsx" inline=true></code>

### Repository
Click the repository button on the navigation to enter the repository list page. If you are a new user, you can see the `create repository` button to create new one. At next time, you will see all the repositories list at this page. Click one repository, you will enter the edit page.

1 On the top left, near the repository name, there has a feature bar, you can see `import`,`export`,`generate ts code` buttons

2 On the top right, you can search interfaces with name or id

3 In the middle, there are modules, you can group multiple interfaces into different modules

4 At the Left, there are interfaces in the active module, when you hover on one list, you can edit or delete it

5 At the right, there are basic info, request and response properties of one interface, you can edit it after click the `edit` button


<code src="./component/repository.tsx" inline=true></code>
### Organization
Click the organization button on the navigation to enter the organization page, you will see all the organizations that you have joined. If you don't have any organizations, you can click the `create` button to add one.

<code src="./component/organization.tsx" inline=true></code>
### Account
Move the mouse to the user name in the upper right corner, and then click "My Account" to view personal information

<code src="./component/user.tsx" inline=true></code>

On the personal information page, you can view and modify your user name, password and other information

