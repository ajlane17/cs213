<?php

  // Create our "database" of goods
  class PurchaseItem {
    public $id;
    public $name;
    public $price;
    
    public function __construct($id, $name, $price) {
      $this->id = $id;
      $this->name = $name;
      $this->price = $price;
    }
  }

  $itemList = [
    "item_0" => new PurchaseItem("item_0", "Yo-Yo", 14.99),
    "item_1" => new PurchaseItem("item_1", "Water Gun", 17.99),
    "item_2" => new PurchaseItem("item_2", "Doll", 21.99),
    "item_3" => new PurchaseItem("item_3", "Playing Cards", 5.99)
  ];

  // Get and validate the params form the post action
  $firstName = filter_input(INPUT_POST, 'first_name', FILTER_SANITIZE_STRING);
  $lastName = filter_input(INPUT_POST, 'last_name', FILTER_SANITIZE_STRING);
  $address = filter_input(INPUT_POST, 'address', FILTER_SANITIZE_STRING);
  $phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING);
  $items = filter_input(INPUT_POST, 'items', FILTER_DEFAULT, FILTER_FORCE_ARRAY);
  $cardType  = filter_input(INPUT_POST, 'card', FILTER_SANITIZE_STRING);
  $cardNumber  = filter_input(INPUT_POST, 'credit_card', FILTER_VALIDATE_INT);
  $cardExp  = filter_input(INPUT_POST, 'exp_date', FILTER_SANITIZE_STRING);

  $isValid = true;

  // Check for missing data
  if (empty($firstName)
  ||  empty($lastName)
  ||  empty($address)
  ||  empty($phone)
  ||  empty($items)
  ||  empty($cardType)
  ||  empty($cardNumber)
  ||  empty($cardExp)) {
    $isValid = false;

  }

  if ($isValid) {
  // Get purchase item details
    $purchasedItems = [];
    $totalPrice = 0;

    foreach ($items as &$item) {
      array_push($purchasedItems, $itemList[$item]);
      $totalPrice += $itemList[$item]->price;
    }

    // Update our date format
    $cardExpDT = DateTime::createFromFormat('m-Y', $cardExp);
  }

?>


<!DOCTYPE html>
<html lang="en">

<head>
  <meta name="description" content="This site provides a simple selection of items available for purchase." />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" type="text/css" href="css/assign11.css">
  <title>Confirm Order - AJ's Shopping Site</title>
</head>

<body>

  <header class="header-grid-container">
    <h1 class="header-grid-item header-item1">AJ's Shopping Site</h1>
    <a href="index.html" class="header-grid-item header-item2">CS 213 Assignments</a>
  </header>

  <section class="main-content">

    <h2 class="section-title text-center">Confirm Order</h2>

    <form id="payment-form" method="POST" action="assign11_a.php">
      <div class="validation-field" id="form_notification">
      <?php if (!$isValid) { echo "Error parsing order data"; } ?>
      </div>
      <fieldset>
        <legend>Customer Details</legend>
        <label for="first_name" class="hand-writing text-label">First Name</label>
        <input type="text" id="first_name" name="first_name" disabled 
          value="<?php if ($isValid) { echo $firstName; } ?>" />

        <label for="last_name" class="hand-writing text-label">Last Name</label>
        <input type="text" id="last_name" name="last_name" disabled 
          value="<?php if ($isValid) { echo $lastName; } ?>" />

        <label for="address" class="hand-writing text-label">Address</label>
        <textarea rows="3" id="address" name="address" disabled><?php
          if ($isValid) { echo $address; }
        ?></textarea>

        <label for="phone" class="hand-writing text-label">Phone</label>
        <input type="text" id="phone" name="phone" disabled 
          value="<?php if ($isValid) { echo $phone; } ?>" />
      </fieldset>

      <fieldset>
        <legend>Purchase Items</legend>
        <ul id="item_list">
          <?php
            if ($isValid) {
              foreach($purchasedItems as &$item) {
                $itemPrice = number_format($item->price, 2);
                echo "<li>\n";
                echo "<input type='checkbox' name='items[]' id='$item->id' value='$item->id' class='purchase_items' checked disabled />\n";
                echo "<label for='$item->id' class='hand-writing'>$item->name - \$$itemPrice</label>\n";
                echo "</li>\n";
              }
            }
          ?>
        </ul>
      </fieldset>

      <fieldset>
        <legend>Payment</legend>

        <ul>
          <?php
            if ($isValid) {
              $cardTypeCased = ucwords($cardType);
              echo "<li>\n";
              echo "<input type='radio' name='card' id='$cardType' value='$cardType' checked disabled />\n";
              echo "<label for='$cardType' class='hand-writing'>$cardTypeCased</label>\n";
              echo "</li>\n";
            }
          ?>
        </ul>
        <div class="validation-field" id="card_notification"></div>

        <label for="credit_card" class="hand-writing text-label">Credit Card #</label>
        <input type="text" id="credit_card" name="credit_card" disabled 
          value="<?php if ($isValid) { echo "..." . substr($cardNumber, -4); } ?>"/>

        <label for="exp_date" class="hand-writing text-label">Credit Card Expiration</label>
        <input type="text" id="exp_date" name="exp_date" disabled
          value="<?php if ($isValid) { echo date_format($cardExpDT, 'F Y'); } ?>" />
      </fieldset>

      <h3 class="hand-writing">Total</h3>
      <div id="total" class="hand-writing">$<?php if ($isValid) { echo $totalPrice; } ?></div>

      <button type="submit" name="confirmation" value="confirmed" <?php if (!$isValid) { echo 'disabled hidden'; } ?>>Confirm</button>
      <button type="submit" name="confirmation" value="canceled" class="cancel-button" <?php if (!$isValid) { echo 'disabled hidden'; } ?>>Cancel</button>
      <?php 
        if (!$isValid) {
          echo "<button type='button' onclick='location.href = \"assign11.html\";'>Back</button>\n";
        }
      ?>
    </form>

  </section>

  <footer><p>&copy; 2020 Adrian Lane</p></footer>

  <script src="scripts/assign11.js"></script>
</body>

</html>