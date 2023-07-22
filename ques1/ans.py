from flask import Flask
import requests
import json
import time

def get_numbers(urls):
  """Retrieves a list of numbers from the specified URLs."""
  numbers = []
  for url in urls:
    start_time = time.time()
    response = requests.get(url, timeout=500)
    if response.status_code == 200:
      data = json.loads(response.content)
      numbers.extend(data["numbers"])
    else:
      print(f"Failed to get numbers from {url}")
    end_time = time.time()
    if end_time - start_time > 500:
      print(f"Timeout for {url}")
  return sorted(list(set(numbers)))

def main():
  """Starts the HTTP microservice."""
  port = 8008
  urls = ["http://20.244.56.144/numbers/rand", "http://abc.com/fibo"]
  app = Flask(__name__)

  @app.route("/numbers")
  def get_numbers_endpoint():
    """Retrieves a list of numbers from the specified URLs."""
    numbers = get_numbers(urls)
    return json.dumps({"numbers": numbers})

  app.run(host="localhost", port=port,"numbers")

if __name__ == "__main__":main()