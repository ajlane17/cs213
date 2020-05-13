<?php

  // Get and validate the params form the query string
  $apr = filter_input(INPUT_GET, 'apr', FILTER_VALIDATE_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
  $term = filter_input(INPUT_GET, 'term', FILTER_VALIDATE_INT);
  $amount = filter_input(INPUT_GET, 'amount', FILTER_VALIDATE_INT);

  $responseBody = null;

  $isValid = (!empty($apr) && !empty($term) && !empty($amount));

  function calculatePayment($apr, $term, $amount) {
    $interest = $apr / 100 / 12;
    $termMonths = $term * 12;
    $factor = (pow((1 + $interest), $termMonths) - 1) / ($interest * pow((1 + $interest), $termMonths));
    return round($amount / $factor, 2);
  }

  if ($isValid) {
    $payment = calculatePayment($apr, $term, $amount);
    $responseBody = '<div class="payment-table">' . "\n";
    $responseBody .= '<div class="payment-field label">APR:</div><div class="payment-field">' . $apr . '%</div>' . "\n";
    $responseBody .= '<div class="payment-field label">Term:</div><div class="payment-field">' . $term . '</div>' . "\n";
    $responseBody .= '<div class="payment-field label">Amount:</div><div class="payment-field">$' . $amount . '</div>' . "\n";
    $responseBody .= '<div class="payment-field label">Payment:</div><div class="payment-field">$' . $payment . '</div>' . "\n";
    $responseBody .= '</div>' . "\n";
  }
  else {
    $responseBody = '<p class="error">There was an error with the values provided.</p>';
  }
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta name="description" content="This site provides a simple selection of financial tools to help with making financial decisions." />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" type="text/css" href="css/mortgage.css">
  <title>Payment - Mortgage Calculator</title>
</head>

<body>

  <header class="header-grid-container">
    <h1 class="header-grid-item header-item1">Financial Tools</h1>
    <a href="index.html" class="header-grid-item header-item2">CS 213 Assignments</a>
  </header>

  <section class="main-content">

    <h2 class="section-title text-center">Mortgage Payment</h2>
    <div class="outer-container">
    <?php
      echo $responseBody;
    ?>
    <a href="mortgage.html" class="button">Back</a>
    </div>

</section>

  <footer><p>&copy; 2020 Adrian Lane</p></footer>

  <script src="scripts/assign07.js"></script>
</body>

</html>