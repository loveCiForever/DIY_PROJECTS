class ContentItemFormatter {
  formatActivity(activity) { return activity.length > 14 ? activity.slice(0, 14) + ". . ." : activity; }
  formatLocation(location) { return location.length > 14 ? location.slice(0, 14) + ". . ." : location; }
  formatTime(time) { return time || "Has not enter time"; }
  formatStatus(completed) { return completed ? "Completed" : "Pending"; }
}

class ContentManager {
  constructor(contentItemFormatter) {
    this.contents = JSON.parse(localStorage.getItem("contents")) || [];
    this.contentItemFormatter = contentItemFormatter;
  }

  addContent(activity, location, time) {
    const newContent = {
      id: this.getRandomId(),
      activity: this.contentItemFormatter.formatActivity(activity),
      location: this.contentItemFormatter.formatLocation(location),
      time: this.contentItemFormatter.formatTime(time),
      completed: false,
      status: "pending",
    };

    this.contents.push(newContent);
    this.saveToLocalStorage();
    return newContent;
  }

  editContent(id, updatedActivity, updatedLocation) {
    const content = this.contents.find((t) => t.id === id);
    if (content) {
      content.activity = updatedActivity;
      content.location = updatedLocation;
      this.saveToLocalStorage();
    }

    return content;
  }

  deleteContent(id) {
    this.contents = this.contents.filter((content) => content.id !== id);
    this.saveToLocalStorage();
  }

  deleteAllButton() {
    if (this.contents.length > 0) {
      this.contents = [];
      this.saveToLocalStorage();
    }
  }

  filterButtons(status) {
    switch (status) {
      case "all":
        return this.contents;
      case "pending":
        return this.contents.filter((content) => !content.completed);
      case "completed":
        return this.contents.filter((content) => content.completed);
      default:
        return []
    }
  }

  getRandomId() { return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); }
  saveToLocalStorage() { localStorage.setItem("contents", JSON.stringify(this.contents)); }
}

class UIManager {
  constructor(ContentManager, contentItemFormatter) {
    this.contentManager = contentManager;
    this.contentItemFormatter = contentItemFormatter;
    this.activityInput = document.querySelector(".activity-input-section");
    this.locationInput = document.querySelector(".location-input-section");
    this.timeInput = document.querySelector(".time-input-section");
    this.addButton = document.querySelector(".add-content-button");
    this.contentsListBody = document.querySelector(".contetns-list-body");
    this.alertMessage = document.querySelector(".alert-message");
    this.deleteAllButton = document.querySelector("delete-all-button");

    this.addEventListeners();
    this.showAllContents();
  }

  addEventListeners() {
    this.addButton.addEventListener("click", () => {
      this.handleAddButton();
    });

    this.activityInput.addEventListener("keyup", (e) => {
      if (e.keyCode === 13 && this.activityInput.value.length > 0) {
        this.handleAddContent();
      }
    });

    this.deleteAllButton.addEventListener("click", () => {
      this.handleDeleteAllContents();
    });

    const filterButtons = document.querySelectorAll(".contents-filter li");
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const status = button.textContent.toLowerCase();
      });
    });
  }

  handleAddContent() {
    const activity = this.activityInput.value;
    const location = this.locationInput.value;
    const time = this.timeInput.value;

    if (activity === "") {
      this.showAlertMessage("Please enter a activity", "error");
    } else {
      const newContent = this.contentManager.addContent(activity, location, time);
      this.showAllContents();
      this.activityInput.value = "";
      this.locationInput.value = "";
      this.timeInput.value = ""
      this.showAlertMessage("Activity added successfully", "success");
    }
  }

  handleDeleteAllContents() {
    this.contentManager.deleteContent();
    this.showAllContents();
    this.showAlertMessage("All activities deleted successfully", "success");
  }

  showAllContents() {
    const contents = this.contentManager.filterButtons('all');
    this.displayContents(contents);
  }

  displayContents(contents) {
    this.contentsListBody.innerHTML = "";

    if (contents.length === 0) {
      this.contentsListBody.innerHTML = `<tr><td colspan="5" class="text-center">No activity found</td></tr>`;
      return;
    }

    contents.forEach((content) => {
      this.contentsListBody.innerHTML += `
                    <tr class="content-item" data-id="${content.id}">
                        <td>${this.contentItemFormatter.formatActivity(content.activity)}</td>
                        <td>${this.contentItemFormatter.formatTime(content.location)}</td>
                        <td>${this.contentItemFormatter.formatTime(content.time)}</td>
                        <td>${this.contentItemFormatter.formatStatus(content.completed)}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="uiManager.handleEditContent('${content.id}')">
                            <i class="bx bx-edit-alt bx-bx-xs"></i>    
                            </button>
                            <button class="btn btn-success btn-sm" onclick="uiManager.handleToggleStatus('${content.id}')">
                            <i class="bx bx-check bx-xs"></i>
                            </button>
                            <button class="btn btn-error btn-sm" onclick="uiManager.handleDeleteAllContents('${content.id}')">
                            <i class="bx bx-trash bx-xs"></i>
                            </button>
                        </td>
                    </tr>
                `;
    });
  }

  hanldeEditContent(id) {
    const content = this.contentManager.contents.find((t) => t.id === id);
    if (content) {
      this.activityInput.value = content.activity;
      this.contentManager.deleteContent(id);

      const handleUpdate = () => {
        this.addButton.innerHTML = "<i class='bx bx-plus bx-sm'></i>";
        this.showAlertMessage("Content updated successfully", "success");
        this.showAllContents();
        this.addButton.removeEventListener("click", handleUpdate);
      };

      this.addButton.innerHTML = "<i class='bx bx-check bx-sm'></i>";
      this.addButton.addEventListener("click", handleUpdate);
    }

  }


}


class ThemeSwitcher {
  constructor(themes, html) {
    this.themes = themes;
    this.html = html;
    this.init();
  }

  init() {
    const theme = this.getThemeFromLocalStorage();
    if (theme) { this.setTheme(theme); }
    this.addThemeEventListeners();
  }

  addThemeEventListeners() {
    this.themes.forEach((theme) => {
      theme.addEventListener("click", () => {
        const themeName = theme.getAttribute("theme");
        this.setTheme(themeName);
        this.saveThemeToLocalStorage(themeName);
      });
    });
  }

  setTheme(themeName) { this.html.setAttribute("data-theme", themeName); }
  getThemeFromLocalStorage() { return localStorage.getItem("theme"); }
  saveThemeToLocalStorage(themeName) { localStorage.setItem("theme", themeName); }
}



// const activityItemFormatter = new ActivityItemFormatter();
// const activityManager = new ActivityManager(activityItemFormatter);
// const uiManager = new UIManager(activityManager, activityItemFormatter);
const themes = document.querySelectorAll(".theme-item");
const html = document.querySelector("html");
const themeSwitcher = new ThemeSwitcher(themes, html);