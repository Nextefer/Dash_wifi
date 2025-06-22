// Protección: si no hay usuario autenticado, redirige
if (!localStorage.getItem('user')) {
  window.location.href = 'login.html';
}

const latencyPanel = document.getElementById("latencyPanel");
const protocolChartCtx = document.getElementById("protocolChart").getContext("2d");
const domainChartCtx = document.getElementById("domainChart").getContext("2d");
const latencyChartCtx = document.getElementById("latencyChart").getContext("2d");

let protocolChart, domainChart, latencyChart;
let latencyData = [];
let latencyLabels = [];
const MAX_LATENCY_POINTS = 20; // Muestra los últimos 20 valores

function medirLatenciaReal() {
  const start = performance.now();
  return fetch("https://dash-wifi.onrender.com/ping")
    .then(() => {
      const latency = Math.floor(performance.now() - start);
      latencyPanel.textContent = `Latencia: ${latency} ms`;

      // Guardar datos para la gráfica
      const now = new Date();
      latencyLabels.push(now.toLocaleTimeString());
      latencyData.push(latency);

      // Mantener solo los últimos N puntos
      if (latencyData.length > MAX_LATENCY_POINTS) {
        latencyData.shift();
        latencyLabels.shift();
      }

      updateLatencyChart();
    })
    .catch(() => {
      latencyPanel.textContent = "Latencia: error";
    });
}

function updateLatencyChart() {
  const data = {
    labels: latencyLabels,
    datasets: [{
      label: 'Latencia (ms)',
      data: latencyData,
      borderColor: '#4c6ef5',
      backgroundColor: 'rgba(76,110,245,0.1)',
      fill: true,
      tension: 0.3,
      pointRadius: 2
    }]
  };

  if (!latencyChart) {
    latencyChart = new Chart(latencyChartCtx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: { display: true }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  } else {
    latencyChart.data = data;
    latencyChart.update();
  }
}

function simulateProtocols() {
  return {
    HTTP: Math.floor(Math.random() * 30) + 10,
    HTTPS: Math.floor(Math.random() * 50) + 30,
    DNS: Math.floor(Math.random() * 20) + 5,
  };
}

function simulateDomains() {
  return {
    "google.com": Math.floor(Math.random() * 40),
    "youtube.com": Math.floor(Math.random() * 30),
    "facebook.com": Math.floor(Math.random() * 20),
    "otros": Math.floor(Math.random() * 10),
  };
}

function updateCharts() {
  const protocols = simulateProtocols();
  const domains = simulateDomains();

  const protocolData = {
    labels: Object.keys(protocols),
    datasets: [{
      label: 'Uso (%)',
      data: Object.values(protocols),
      backgroundColor: ['red', 'green', 'blue']
    }]
  };

  const domainData = {
    labels: Object.keys(domains),
    datasets: [{
      label: 'Tráfico (%)',
      data: Object.values(domains),
      backgroundColor: ['orange', 'purple', 'cyan', 'gray']
    }]
  };

  if (!protocolChart) {
    protocolChart = new Chart(protocolChartCtx, {
      type: 'bar',
      data: protocolData,
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    });
  } else {
    protocolChart.data = protocolData;
    protocolChart.update();
  }

  if (!domainChart) {
    domainChart = new Chart(domainChartCtx, {
      type: 'pie',
      data: domainData
    });
  } else {
    domainChart.data = domainData;
    domainChart.update();
  }
}

function logout() {
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

// Primeras ejecuciones
medirLatenciaReal();
updateCharts();

// Cada 10 segundos
setInterval(() => {
  medirLatenciaReal();
  updateCharts();
}, 10000);

document.getElementById('protocolFilter').addEventListener('change', function() {
  const filtro = this.value;
  updateProtocolChart(filtro);
});

document.getElementById('domainFilter').addEventListener('input', function() {
  const filtro = this.value.trim();
  updateDomainChart(filtro);
});

// Ejemplo de función para actualizar la gráfica de protocolos
function updateProtocolChart(filtro) {
  // Obtén los datos simulados
  const protocols = simulateProtocols();

  // Filtra los datos según el protocolo seleccionado
  let filteredProtocols;
  if (filtro === "all") {
    filteredProtocols = protocols;
  } else {
    filteredProtocols = {};
    if (protocols[filtro]) {
      filteredProtocols[filtro] = protocols[filtro];
    }
  }

  // Prepara los datos para la gráfica
  const protocolData = {
    labels: Object.keys(filteredProtocols),
    datasets: [{
      label: 'Uso (%)',
      data: Object.values(filteredProtocols),
      backgroundColor: ['red', 'green', 'blue']
    }]
  };

  // Actualiza la gráfica
  if (!protocolChart) {
    protocolChart = new Chart(protocolChartCtx, {
      type: 'bar',
      data: protocolData,
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    });
  } else {
    protocolChart.data = protocolData;
    protocolChart.update();
  }
}

// Ejemplo de función para actualizar la gráfica de dominios
function updateDomainChart(filtro) {
  // Obtén los datos simulados
  const domains = simulateDomains();

  // Filtra los dominios según el texto ingresado (insensible a mayúsculas/minúsculas)
  let filteredDomains = {};
  if (!filtro) {
    filteredDomains = domains;
  } else {
    Object.keys(domains).forEach(domain => {
      if (domain.toLowerCase().includes(filtro.toLowerCase())) {
        filteredDomains[domain] = domains[domain];
      }
    });
  }

  // Prepara los datos para la gráfica
  const domainData = {
    labels: Object.keys(filteredDomains),
    datasets: [{
      label: 'Tráfico (%)',
      data: Object.values(filteredDomains),
      backgroundColor: ['orange', 'purple', 'cyan', 'gray']
    }]
  };

  // Actualiza la gráfica
  if (!domainChart) {
    domainChart = new Chart(domainChartCtx, {
      type: 'pie',
      data: domainData
    });
  } else {
    domainChart.data = domainData;
    domainChart.update();
  }
}
