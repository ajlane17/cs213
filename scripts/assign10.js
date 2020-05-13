// HTML elements
const FileTableBody = document.getElementById('file-table-body');
const TableError = document.getElementById('table-error');

/**
 * Retrieves the contents of a text-based file
 * Returns a promise with the resulting data
 * @param {string} path The relative path or url to the file
 */
async function httpGet(path) {
    const req = new XMLHttpRequest();
    return new Promise(function(resolve, reject) {
        req.onreadystatechange = function() {
            if (req.readyState == 4) {
                if (req.status >= 300) {
                    reject("Error getting contents for "
                        + path + ": status = "
                        + req.status);
                }
                else {
                resolve(req.responseText);
                }
            }
        }
        req.open('GET',path, true);
        req.send();
    });
}

/**
 * This method returns a collection of file objects
 * On error, returns error details
 * @param {string} path file or path to fetch JSON response
 */
async function getFiles(path) {
    try {
        response = await httpGet(path);
        response = JSON.parse(response);
        success = true;
    }
    catch (error) {
        response = error;
        success = false;
    }

    return { response: response, success: success};
}

/**
 * Generates the table display for a file list
 */
async function DisplayData() {
    files = await getFiles('assign10.php');

    if (!files.success) {
        TableError.innerHTML = "Error: " + files.response;
        return
    }

    for (file of files.response) {
        // create table row
        const itemRow = document.createElement('tr');

        // create table row data
        const fileName = document.createElement('td');
        fileName.innerHTML = file.fileName;
        itemRow.appendChild(fileName);
        
        const fileType = document.createElement('td');
        fileType.innerHTML = file.fileType;
        itemRow.appendChild(fileType);

        const fileCwd = document.createElement('td');
        fileCwd.innerHTML = file.cwd;
        itemRow.appendChild(fileCwd);

        const action = document.createElement('td');
        if (file.fileType != "dir") {
            const actionA = document.createElement('a');
            const link = document.createTextNode("Click to display");
            actionA.appendChild(link);
            actionA.title = file.fileName;
            actionA.href = "javascript:void(0)";
            actionA.setAttribute('onclick', 'newTab("' + file.fileName + '");');
            actionA.setAttribute('class', "button");
            action.appendChild(actionA);
        }
        itemRow.appendChild(action);

        // attach table row
        FileTableBody.appendChild(itemRow);
    }
}

/**
 * Opens a link in a new tab
 * @param {string} path 
 */
function newTab(path) {
    window.open(path);
}

// On load, get data
document.addEventListener('DOMContentLoaded', function() {
    DisplayData();
 }, false);