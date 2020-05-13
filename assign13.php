<?php

// Entry object
class Entry {
    public $entryId;
    public $entryType;
    public $students;
    public $skill;
    public $instrument;
    public $location;
    public $room;
    public $timeSlot;
}

// Student object
class Student {
    public $studentId;
    public $firstName;
    public $lastName;
}

// Returns the SQLite DB connection
class SQLiteConnection {

    private $pdo;
 
    public function connect() {
        if ($this->pdo == null) {
            $this->pdo = new \PDO("sqlite:" . "data/assign13.db");
        }
        return $this->pdo;
    }
}

// Creates the entries table
function CreateTable($pdo) {
    $command = 'CREATE TABLE IF NOT EXISTS entries (
                    entry_id INTEGER PRIMARY KEY,
                    entry_type VARCHAR (255) NOT NULL,
                    students VARCHAR (255) NOT NULL,
                    skill VARCHAR (255) NOT NULL,
                    instrument VARCHAR (255) NOT NULL,
                    location VARCHAR (255) NOT NULL,
                    room INTEGER NOT NULL,
                    time_slot VARCHAR (255) NOT NULL)';

    $pdo->exec($command);
}

// Inserts an entry into the DB
function InsertEntry($pdo, $entry) {
    $sql = 'INSERT INTO entries (
                            entry_type,
                            students,
                            skill,
                            instrument,
                            location,
                            room,
                            time_slot)
                        VALUES (
                            :entry_type,
                            :students,
                            :skill,
                            :instrument,
                            :location,
                            :room,
                            :time_slot)';
    
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':entry_type', $entry->entryType);
    $stmt->bindValue(':students', json_encode($entry->students));
    $stmt->bindValue(':skill', $entry->skill);
    $stmt->bindValue(':instrument', $entry->instrument);
    $stmt->bindValue(':location', $entry->location);
    $stmt->bindValue(':room', $entry->room);
    $stmt->bindValue(':time_slot', $entry->timeSlot);
    $stmt->execute();

    return $pdo->lastInsertId();
}

function DeleteEntry($pdo, $entryId) {
    $sql = 'DELETE FROM entries WHERE entry_id = :entry_id';

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':entry_id', $entryId);

    $stmt->execute();

    return $stmt->rowCount();
}

// Get all entries from the DB
function GetEntries($pdo) {
    $stmt = $pdo->query('SELECT * FROM entries');

    $entries = [];
    while ($entry = $stmt->fetchObject()) {
        $newEntry = new Entry();
        $newEntry->entryId = (int)$entry->entry_id;
        $newEntry->entryType = $entry->entry_type;
        $newEntry->students = json_decode($entry->students);
        $newEntry->skill = $entry->skill;
        $newEntry->instrument = $entry->instrument;
        $newEntry->location = $entry->location;
        $newEntry->room = (int)$entry->room;
        $newEntry->timeSlot = $entry->time_slot;
        $entries[] = $newEntry;
    }

    return $entries;
}

// Create the connection and create the table
$pdo = (new SQLiteConnection())->connect();
if ($pdo != null) {
    CreateTable($pdo);
}
else {
    echo 'FATAL ERROR: Could not connect to the database';
}

// Process POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action'] === 'add') {
    // Validate POST input
    $student01FirstName = filter_input(INPUT_POST, 'first_name_01', FILTER_SANITIZE_STRING);
    $student01LastName = filter_input(INPUT_POST, 'last_name_01', FILTER_SANITIZE_STRING);
    $student01Id  = filter_input(INPUT_POST, 'student_id_01', FILTER_VALIDATE_INT);

    $student02FirstName = filter_input(INPUT_POST, 'first_name_02', FILTER_SANITIZE_STRING);
    $student02LastName = filter_input(INPUT_POST, 'last_name_02', FILTER_SANITIZE_STRING);
    $student02Id  = filter_input(INPUT_POST, 'student_id_02', FILTER_VALIDATE_INT);

    $entryType = filter_input(INPUT_POST, 'performance', FILTER_SANITIZE_STRING);
    $skill = filter_input(INPUT_POST, 'skill', FILTER_SANITIZE_STRING);
    $instrument = filter_input(INPUT_POST, 'instrument', FILTER_SANITIZE_STRING);
    $location = filter_input(INPUT_POST, 'location', FILTER_SANITIZE_STRING);
    $room  = filter_input(INPUT_POST, 'room', FILTER_VALIDATE_INT);
    $timeSlot = filter_input(INPUT_POST, 'time_slot', FILTER_SANITIZE_STRING);

    $isValid = true;

    // Check for missing data
    if (empty($student01FirstName)
    ||  empty($student01LastName)
    ||  empty($student01Id)
    ||  empty($entryType)
    ||  empty($skill)
    ||  empty($instrument)
    ||  empty($location)
    ||  empty($room)
    ||  empty($timeSlot)) {
        $isValid = false;
    }

    // Check for second student if needed
    if ($entryType === 'duet' 
    && (empty($student02FirstName)
    ||  empty($student02LastName)
    ||  empty($student02Id))) {
        $isValid = false;
    }

    if ($isValid) {

        $students = [];

        // Add first student
        $student01 = new Student();
        $student01->studentId = $student01Id;
        $student01->firstName = $student01FirstName;
        $student01->lastName = $student01LastName;
        $students[] = $student01;

        // Add second student if needed
        if ($entryType === 'duet') {
            $student02 = new Student();
            $student02->studentId = $student02Id;
            $student02->firstName = $student02FirstName;
            $student02->lastName = $student02LastName;
            $students[] = $student02;
        }

        // Construct entry
        $entry = new Entry();
        $entry->entryType = $entryType;
        $entry->students = $students;
        $entry->skill = $skill;
        $entry->instrument = $instrument;
        $entry->location = $location;
        $entry->room = $room;
        $entry->timeSlot = $timeSlot;

        // Commit and return the new ID
        echo InsertEntry($pdo, $entry);
    }
    else {
        http_response_code(500);
        echo "ERROR: Invalid request";
    }
}

// Process GET request
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $entries = GetEntries($pdo);

    header('Content-Type: application/json');
    echo json_encode($entries);
}

// Process DELETE request
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action'] === 'delete') {
    $id  = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);

    if (!empty($id)) {
        echo DeleteEntry($pdo, $id);
    }
    else {
        http_response_code(500);
        echo "ERROR: Invalid request";
    }
}

?>