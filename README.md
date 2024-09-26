# CS:GO Team Builder
This code forms a single-page application that allows the user to build a Counter-Strike player, loadout, and team. This application queries the [CS:GO API](https://bymykel.github.io/CSGO-API/), as well as the [Random User API](https://randomuser.me/) (for teammate names).

This project was not tested as a native HTML page in-browser - it should be run via the live server extension in VS Code (and may work in Node.js, but untested).

## Features
In addition to all project requirements, some notable features of the app are as follows:
- Preloading of all data from the APIs upon launching of the application.
- Pregenerating all HTML used in the app to improve performance and enable smooth navigation between pages.
- Backwards navigation, allowing the user to return to previous screens and change data without having to reset the entire application.
- A reset button to clear and restart the application without having to refresh the page or restart the live server.
- Some neat animations and styles to make a sleek UI. :)
- Indicators on the weapon selection page to identify which categories and weapons have skins selected.
- Scroll indicators on certain elements to indicate there is more content offscreen that can be scrolled to.
- Weapon displays on the summary pages can be clicked to show a details popup.

## Caveats
There are a few caveats to note with the application. These aren't breaking issues, and (most of them, minus point 1) don't violate the requirements of the project, but you should be aware of them when using the app.
- The folder structure doesn't exactly match the requested structure in the project outline. I created the folder structure before I realized this requirement, and it was ingrained too deeply in the project to make it reasonable to change every file path to match this structure. Hopefully this isn't a dealbreaker for the grade, since the project is still fully functionaly (and the division I've created is very similar to what was requested, except for the fact that all of the non-HTML files live in the assets folder).
- The code is very messy. I've tried to make it as readable as possible and comment as much as I can, but the order of functions (especially in main.js) is only loosely structured, so code flow might be difficult to follow. Reach out to me if there's any confusion.
- Test files, like test_screen.html and test_styles.css, aren't actually used in the project - it was just a testing ground for things before I started writing code.
- Validation errors are shown via alert popups rather than inline styles. The main reason for this is that I ran out of time to implement the styles.
- The summary pages (character and team) have indicators to show that there is content offscreen that needs to scroll, but for some reason they don't show up until you scroll for the first time. I wasn't able to figure out why before submitting. The most important note with this point is that you *can* select more than 6 weapons, but you will have to scroll down on the character summary page to see any past the first 6, which is not immediately obvious.
- Navigating backwards to team selection and changing teams will reset your operator and weapon selections. This has to be done, as operators and weapons are filtered by team. This change is indicated via an alert popup, and can be canceled to maintain current selections.

[//]: # "Feel free to reach out to me at [k_jubar@fanshaweonline.ca](mailto:k_jubar@fanshaweonline.ca) if you come across any weirdness or issues while testing and I'll be happy to explain! I've also been maintaining a GitHub repo with the code, commit history, and issues - it's currently private, but feel free to email me if you're interested in seeing the repo and I'd be happy to share it with you."

[//]: # "## Closing note"
[//]: # "To be completely honest, writing this project has probably been the most fun I've had with programming in years. The creative freedom to build whatever I want, the ability to fully design the infrastructure and code behind the application, and adding all of the bells and whistles has helped me rediscover a love of programming that I had lost some of due to burnout at work. I will certainly continue enhancing this project and maintaining the GitHub repo even after I submit, because it's been so fun to figure out and work on. Thank you for this amazing opportunity!)"
