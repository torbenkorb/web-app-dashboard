var tabSwitch = (function() {
    var tabswitchEl = document.querySelector('.chart__switch');
    var charts = document.querySelectorAll('.chart');
    var switches = document.querySelectorAll('.chart__switch button');
    var data = {
        hourly: {
            labels: ["0-6", "7-12", "13-18", "19-24"],
            values: [80, 120, 230, 100]
        },
        daily: {
            labels: ["S", "M", "T", "W", "T", "F", "S"],
            values: [75, 100, 175, 125, 225, 200, 100]
        },
        weekly: {
            labels: ["16-22", "23-29", "30-5", "6-12", "13-19", "20-26", "27-3", "4-10", "11-17", "18-24", "25-31"],
            values: [750, 1250, 1000, 1500, 2000, 1500, 1750, 1250, 1750, 2250, 1750, 2250]
        },
        monthly: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            values: [2250, 2100, 2350, 2500, 1980, 1890, 2120, 2450, 2550, 2650, 2800, 2950, 2650]
        }
    };

    tabswitchEl.addEventListener('click', function(e) {
        if(e.target.tagName === 'BUTTON') {
            var target = e.target;
            var index = target.dataset.index;

            mainChart.config.data.labels = data[index].labels;
            mainChart.config.data.datasets[0].data = data[index].values;
            mainChart.update();

            [].forEach.call(switches, function(switchEl) {
                switchEl.classList.remove('active');
            });
            e.target.classList.add('active');
        }
    });
})();

var alertMessage = (function() {
    var alertBox = document.querySelector('.alert');
    var notificationElement = document.querySelector('.notification');
    var alertCloseButton = document.querySelector('.alert__close');
    notificationDropdown = document.querySelector('.notification__dropdown');

    alertCloseButton.addEventListener('click', function() {
        alertBox.style.display = 'none';
        notificationElement.classList.remove('has-notification');
    });

    notificationElement.addEventListener('click', function() {
        notificationDropdown.classList.toggle('active');
        notificationElement.classList.remove('has-notification');
    });
})();

var formSubmission = (function() {
    var formElement = document.querySelector('.form');
    var dialogElement = document.querySelector('.dialog');
    var dialogMessage = document.querySelector('.dialog__message')
    var dialogClose = document.querySelector('.dialog__close');
    var userField = document.querySelector('#msg__user');
    var autocomplete = document.querySelector('.autocomplete');
    var autocompleteUsers = document.querySelectorAll('.autocomplete .user');

    formElement.addEventListener('submit', function(e) {
        e.preventDefault();
        var message = '';
        if(!e.target['0'].value || !e.target['1'].value) {
            message = 'Please fill out all fields';
        } else {
            message = 'Your message was succesfully sent';
        }
        dialogMessage.textContent = message;
        dialogElement.classList.add('active');
    });

    dialogClose.addEventListener('click', function() {
        dialogElement.classList.remove('active');
        dialogMessage.textContent = '';
    });

    autocomplete.addEventListener('click', function(e) {
        if(e.target.classList.contains('user')) {
            userField.value = e.target.textContent;
            autocomplete.style.display = 'none';
        }
    });

    userField.addEventListener('input', function(e) {
        var searchTerm = e.target.value.toLowerCase();
        console.log(searchTerm);
        if(searchTerm) {
            autocomplete.style.display = 'block';
        } else {
            autocomplete.style.display = 'none';
        }

        [].forEach.call(autocompleteUsers, function(user) {
            if(user.textContent.toLowerCase().indexOf(searchTerm) !== -1 ) {
                user.style.display = 'block';
            } else {
                user.style.display = 'none';
            }
        });
    });
})();

var storageModule = (function() {

    var settingsModule = document.querySelector('.settings');
    var checkboxes = settingsModule.querySelectorAll('input[type=checkbox]');
    var saveButton = document.querySelector('.save');
    var cancelButton = document.querySelector('.cancel');
    var timezoneDropdown = document.querySelector('#DropDownTimezone');

    var initialState = {
        notify: false,
        public: false,
        timezone: 0
    };

    if (storageAvailable('localStorage')) {
      if(!localStorage.getItem('techdegree-project-9')) {
        save();
      } else {
        load();
        updateSettings();
      }
    }

    function save() {
        initialState.notify = checkboxes[0].checked;
        initialState.public = checkboxes[1].checked;
        initialState.timezone = timezoneDropdown.selectedIndex;
        localStorage.setItem('techdegree-project-9', JSON.stringify(initialState));
    }

    function load() {
        initialState = JSON.parse(localStorage.getItem('techdegree-project-9'));
        updateSettings();
    }

    function updateSettings() {
        checkboxes[0].checked = initialState.notify;
        checkboxes[1].checked = initialState.public;
        timezoneDropdown.selectedIndex = initialState.timezone;
    }

    saveButton.addEventListener('click', function() {
        save();
    });

    cancelButton.addEventListener('click', function() {
        load();
    });


})();

function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}
