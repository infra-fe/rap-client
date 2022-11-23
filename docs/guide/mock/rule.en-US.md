# Path Rule

- Mock server rule: RAP platform URL + mock + repository id + method + interface actual request path

- Suppose your rap deployment address is: https://rap.io and use this address as an example

```
mock address: https://rap.io/api/app/mock/154/get/example/interface

```
# Match Steps

1. Fuzzy search for current repository and collaborate repositories by relative path
2. Find all the path matched interfaces with the document
3. Filtered all query params matched interfaces
4. The current repository result is priority to return
5. If 1-4 not find, use the regexp find if there are exits some RESTFUL(/:id or /{id}) url.
6. If there are exits multiple result in 5 step, it will return error
7. If there are none result, it will return error too
8. Find if it is a `scene` request, return the scene data if exited
9. Checked the matched interface's `require` params if it is a `get` or `post` method
10. If the response code is 301, then redirect
11. Generate mock data and return
12. If it has `callback` params, wrap the data as jsonp format

