<?php
  // Get and validate the params form the post action
  $confirmation = filter_input(INPUT_POST, 'confirmation', FILTER_SANITIZE_STRING);

  $title = '';
  $isValid = true;

  // Check for missing data
  if (empty($confirmation)) {
    $title = "Something Went Wrong";
    $isValid = false;
  }
  else {
    $title = "Order " . ucwords($confirmation);
  }

?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta name="description" content="This site provides a simple selection of items available for purchase." />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" type="text/css" href="css/assign11.css">
  <title><?php echo $title; ?> - AJ's Shopping Site</title>
</head>

<body>

  <header class="header-grid-container">
    <h1 class="header-grid-item header-item1">AJ's Shopping Site</h1>
    <a href="index.html" class="header-grid-item header-item2">CS 213 Assignments</a>
  </header>

  <section class="main-content">

    <h2 class="section-title text-center"><?php echo $title; ?></h2>

    <p class="text-center"> <?php if ($isValid) { echo "The order is " . $confirmation . '.'; } ?></p>

  </section>

  <footer><p>&copy; 2020 Adrian Lane</p></footer>

  <script src="scripts/assign11.js"></script>
</body>

</html>