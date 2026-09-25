(function () {
  "use strict";

  var header = document.querySelector("[data-header]");
  var menuButton = document.querySelector("[data-menu-button]");
  var navigation = document.querySelector("[data-navigation]");
  var year = document.getElementById("jahr");

  if (year) year.textContent = String(new Date().getFullYear());

  function updateHeader() {
    if (header) header.classList.toggle("ist-kompakt", window.scrollY > 24);
  }
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  function closeMenu() {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute("aria-expanded", "false");
    navigation.classList.remove("ist-offen");
    menuButton.querySelector(".sr-only").textContent = "Menü öffnen";
  }

  if (menuButton && navigation) {
    menuButton.addEventListener("click", function () {
      var isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      navigation.classList.toggle("ist-offen", !isOpen);
      menuButton.querySelector(".sr-only").textContent = isOpen ? "Menü öffnen" : "Menü schließen";
    });
    navigation.querySelectorAll("a").forEach(function (link) { link.addEventListener("click", closeMenu); });
    document.addEventListener("keydown", function (event) { if (event.key === "Escape") closeMenu(); });
  }

  var vehicleScene = document.querySelector("[data-vehicle-scene]");
  if (vehicleScene) {
    var vehicleViews = Array.from(vehicleScene.querySelectorAll("[data-vehicle-view]"));
    var vehicleSelectors = Array.from(document.querySelectorAll("[data-vehicle-select]"));
    var vehicleOrder = ["front", "side", "rear"];
    var currentVehicleView = 0;
    var dragAnchorX = 0;
    var dragDistance = 0;
    var draggingVehicle = false;
    var vehicleStep = 68;

    function showVehicleView(index) {
      currentVehicleView = (index + vehicleOrder.length) % vehicleOrder.length;
      var selected = vehicleOrder[currentVehicleView];
      vehicleViews.forEach(function (view) {
        var isActive = view.dataset.vehicleView === selected;
        view.classList.toggle("is-active", isActive);
        view.setAttribute("aria-hidden", String(!isActive));
      });
      vehicleSelectors.forEach(function (button) {
        var isActive = button.dataset.vehicleSelect === selected;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });
      vehicleScene.dataset.vehicleAngle = selected;
      vehicleScene.style.setProperty("--vehicle-drag", "0px");
      vehicleScene.style.setProperty("--vehicle-tilt", "0deg");
    }

    function stopVehicleDrag(event) {
      if (!draggingVehicle) return;
      draggingVehicle = false;
      vehicleScene.classList.remove("is-dragging");
      if (Math.abs(dragDistance) > 24) showVehicleView(currentVehicleView + (dragDistance < 0 ? 1 : -1));
      vehicleScene.style.setProperty("--vehicle-drag", "0px");
      vehicleScene.style.setProperty("--vehicle-tilt", "0deg");
      if (event && vehicleScene.hasPointerCapture && vehicleScene.hasPointerCapture(event.pointerId)) {
        vehicleScene.releasePointerCapture(event.pointerId);
      }
    }

    vehicleScene.addEventListener("pointerdown", function (event) {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      if (event.target.closest("[data-hotspot]")) return;
      draggingVehicle = true;
      dragAnchorX = event.clientX;
      dragDistance = 0;
      vehicleScene.classList.add("is-dragging");
      vehicleScene.setPointerCapture(event.pointerId);
    });
    vehicleScene.addEventListener("pointermove", function (event) {
      if (!draggingVehicle) return;
      dragDistance = event.clientX - dragAnchorX;
      if (Math.abs(dragDistance) >= vehicleStep) {
        showVehicleView(currentVehicleView + (dragDistance < 0 ? 1 : -1));
        dragAnchorX = event.clientX;
        dragDistance = 0;
      }
      var visibleDrag = Math.max(-20, Math.min(20, dragDistance * .2));
      vehicleScene.style.setProperty("--vehicle-drag", visibleDrag + "px");
      vehicleScene.style.setProperty("--vehicle-tilt", Math.max(-5, Math.min(5, dragDistance * -.055)) + "deg");
    });
    vehicleScene.addEventListener("pointerup", stopVehicleDrag);
    vehicleScene.addEventListener("pointercancel", stopVehicleDrag);
    vehicleScene.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      showVehicleView(currentVehicleView + (event.key === "ArrowRight" ? 1 : -1));
    });
    vehicleSelectors.forEach(function (button) {
      button.addEventListener("click", function () {
        showVehicleView(vehicleOrder.indexOf(button.dataset.vehicleSelect));
      });
    });
    showVehicleView(0);
  }

  var modules = {
    kamera: {
      status: "Front und Heck · Monitor im Cockpit",
      title: "Kamera & Sicht",
      text: "Digitale Sichtsysteme reduzieren tote Winkel und geben beim Rangieren ein klares Bild – passend zur Geometrie Ihres Fahrzeugs geplant.",
      items: ["Digitaler Innenspiegel mit Heckkamera", "360°-Birdview aus vier Kameras", "Außenspiegel-Ersatz nur mit passender Abnahme"]
    },
    smart: {
      status: "Zentrale · Tablet im Wohnraum",
      title: "SmartCamper",
      text: "Ein Wandtablet und die App auf Ihrem Telefon bündeln Werte und Funktionen. Sensoren melden sich, bevor etwas knapp wird.",
      items: ["Zentrale Steuerung mit Wandtablet und App", "Einbindung von Truma, Dometic und Victron", "Füllstand-, Gas- und Temperatursensoren"]
    },
    internet: {
      status: "Dach · Starlink aktiv, 5G bereit",
      title: "Internet Pro",
      text: "Starlink und 5G arbeiten als abgestimmtes Netz. Bricht eine Verbindung ab, übernimmt die andere automatisch.",
      items: ["Flach montierte Starlink-Antenne", "5G-Router mit leistungsfähiger Dachantenne", "WLAN im gesamten Fahrzeug und Fernzugriff"]
    },
    security: {
      status: "Aufbautür · Security aktiv",
      title: "Security & Recovery",
      text: "Tür- und Klappenkontakte, Ortung und Gefahrenmelder informieren Sie direkt, wenn am Fahrzeug etwas passiert.",
      items: ["Alarmanlage mit Kontakten und Sirene", "GPS-Ortung mit Geofencing", "Gas- und Rauchmelder mit Benachrichtigung"]
    },
    autarkie: {
      status: "Unterflur · Energiesystem bereit",
      title: "Autarkie & Komfort",
      text: "Lithium, Solar und Ladetechnik werden aus Ihrer Nutzung berechnet. Komfortsysteme planen wir mit Blick auf Gewicht und Reserven.",
      items: ["Lithium-Batterie mit abgestimmter Ladetechnik", "Solarleistung nach Energiebilanz", "Hubstützen, Luftfederung, Klima und Wassertechnik"]
    }
  };

  var moduleButtons = document.querySelectorAll("[data-modul]");
  function showModule(id) {
    var module = modules[id];
    if (!module) return;
    var status = document.getElementById("modul-status");
    var title = document.getElementById("modul-titel");
    var text = document.getElementById("modul-text");
    var list = document.getElementById("modul-liste");
    if (status) status.innerHTML = "<span></span> " + module.status;
    if (title) title.textContent = module.title;
    if (text) text.textContent = module.text;
    if (list) {
      list.innerHTML = "";
      module.items.forEach(function (item) {
        var li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
      });
    }
    moduleButtons.forEach(function (button) {
      button.setAttribute("aria-pressed", button.dataset.modul === id ? "true" : "false");
    });
  }
  moduleButtons.forEach(function (button) {
    button.addEventListener("click", function () { showModule(button.dataset.modul); });
  });

  var form = document.getElementById("konfigurator");
  if (!form) return;

  var steps = form.querySelectorAll("fieldset[data-schritt]");
  var progress = form.querySelectorAll(".fortschritt span");
  var stepLabel = document.getElementById("schritt-anzeige");
  var next = document.getElementById("weiter");
  var back = document.getElementById("zurueck");
  var submit = document.getElementById("absenden");
  var error = document.getElementById("fehler");
  var current = 1;
  var summaryText = "";
  var names = { kamera: "Kamera & Sicht", smart: "SmartCamper", internet: "Internet Pro", security: "Security & Recovery", autarkie: "Autarkie & Komfort" };

  function selected() {
    return Array.prototype.map.call(form.querySelectorAll('input[name="baustein"]:checked'), function (input) { return input.value; });
  }

  function recommendation(selection) {
    function has(value) { return selection.indexOf(value) !== -1; }
    if (!selection.length) return null;
    if (has("autarkie") && selection.length >= 3) return { name: "Expedition Signature", price: "ab 31.900 €" };
    if (has("kamera") && has("smart") && has("internet") && has("security")) return { name: "Command Center", price: "ab 19.900 €" };
    if ((has("kamera") || has("security")) && !has("smart") && !has("internet") && !has("autarkie")) return { name: "Vision & Security", price: "ab 9.500 €" };
    if (has("internet") && selection.length === 1) return { name: "Internet Pro", price: "ab 3.500 €" };
    if ((has("internet") || has("smart")) && !has("kamera") && !has("security") && !has("autarkie")) return { name: "Touring Connected", price: "ab 8.900 €" };
    return { name: "Individuelle Kombination", price: "Preis nach Technik-Check" };
  }

  function updateRecommendation() {
    var result = recommendation(selected());
    document.getElementById("vorschlag-name").textContent = result ? result.name : "Wählen Sie mindestens einen Baustein";
    document.getElementById("vorschlag-spanne").textContent = result ? result.price : "";
  }
  form.querySelectorAll('input[name="baustein"]').forEach(function (input) { input.addEventListener("change", updateRecommendation); });

  function goTo(step) {
    current = step;
    steps.forEach(function (fieldset) { fieldset.hidden = Number(fieldset.dataset.schritt) !== step; });
    progress.forEach(function (marker, index) { marker.className = index + 1 < step ? "fertig" : (index + 1 === step ? "aktiv" : ""); });
    stepLabel.textContent = "Schritt " + step + " von 4";
    back.hidden = step === 1;
    next.hidden = step === 4;
    submit.hidden = step !== 4;
    if (error) error.hidden = true;
  }

  function valid(step) {
    if (step === 2 && !selected().length) {
      document.getElementById("vorschlag-name").textContent = "Bitte wählen Sie mindestens einen Baustein.";
      return false;
    }
    return true;
  }

  next.addEventListener("click", function () {
    if (!valid(current)) return;
    goTo(current + 1);
    var first = form.querySelector('fieldset[data-schritt="' + current + '"] input, fieldset[data-schritt="' + current + '"] select');
    if (first) first.focus({ preventScroll: true });
  });
  back.addEventListener("click", function () { goTo(current - 1); });

  document.querySelectorAll("[data-preset]").forEach(function (link) {
    link.addEventListener("click", function () {
      var preset = link.dataset.preset.split(",");
      form.querySelectorAll('input[name="baustein"]').forEach(function (input) { input.checked = preset.indexOf(input.value) !== -1; });
      updateRecommendation();
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var nameInput = form.elements.namedItem("name");
    var phoneInput = form.elements.namedItem("telefon");
    var customerName = nameInput.value.trim();
    var phone = phoneInput.value.trim();
    if (!customerName || !phone) {
      error.textContent = "Bitte tragen Sie Ihren Namen und Ihre Telefonnummer ein, damit ein Rückruf vorbereitet werden kann.";
      error.hidden = false;
      (customerName ? phoneInput : nameInput).focus();
      return;
    }

    var vehicleType = (form.querySelector('input[name="typ"]:checked') || {}).value || "–";
    var result = recommendation(selected());
    var manufacturer = form.elements.namedItem("hersteller").value.trim();
    var buildYear = form.elements.namedItem("baujahr").value.trim();
    var length = form.elements.namedItem("laenge").value.trim();
    var weight = form.elements.namedItem("zgg").value;
    var vehicle = [vehicleType, manufacturer, buildYear, length ? length + " m" : "", weight].filter(Boolean).join(" · ");
    var rows = [
      ["Fahrzeug", vehicle],
      ["Bausteine", selected().map(function (id) { return names[id]; }).join(", ")],
      ["Vorschlag", result.name],
      ["Einstiegspreis", result.price],
      ["Rückruf", phone + " · " + form.elements.namedItem("zeit").value]
    ];
    var list = document.getElementById("ergebnis-liste");
    list.innerHTML = "";
    rows.forEach(function (row) {
      var dt = document.createElement("dt");
      var dd = document.createElement("dd");
      dt.textContent = row[0];
      dd.textContent = row[1];
      list.appendChild(dt);
      list.appendChild(dd);
    });
    document.getElementById("ergebnis-titel").textContent = "Danke, " + customerName + ".";
    summaryText = "Skydancer Projektanfrage\n" + rows.map(function (row) { return row[0] + ": " + row[1]; }).join("\n");
    steps.forEach(function (fieldset) { fieldset.hidden = true; });
    form.querySelector(".formular__nav").hidden = true;
    form.querySelector(".fortschritt").hidden = true;
    stepLabel.hidden = true;
    var resultBox = document.getElementById("ergebnis");
    resultBox.hidden = false;
    resultBox.focus();
  });

  var copyButton = document.getElementById("kopieren");
  var copyStatus = document.getElementById("kopierstatus");
  if (copyButton) {
    copyButton.addEventListener("click", function () {
      function done() { copyStatus.textContent = "Zusammenfassung wurde kopiert."; }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(summaryText).then(done).catch(function () { copyStatus.textContent = "Kopieren war nicht möglich. Bitte markieren Sie die Angaben manuell."; });
      } else {
        var area = document.createElement("textarea");
        area.value = summaryText;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        try { document.execCommand("copy"); done(); } catch (ignore) { copyStatus.textContent = "Kopieren war nicht möglich. Bitte markieren Sie die Angaben manuell."; }
        document.body.removeChild(area);
      }
    });
  }
})();
