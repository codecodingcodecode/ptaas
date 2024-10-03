from flask import Flask, request, jsonify
import subprocess
import json

app = Flask(__name__)

@app.route('/wapiti-scan/', methods=['POST'])
def wapiti_scan():
    data = request.get_json()
    url = data.get('url')
    
    if not url:
        return jsonify({
            "error": "No URL provided"
        }), 400
    
    try:
        # Execute Wapiti with JSON output, capturing it to stdout
        wapiti_result = subprocess.run(
            ['wapiti', '-u', url, '-f', 'json', '-m', 'backup,exec,file,sql,xss', '-o', '/dev/stdout'], 
            capture_output=True, text=True
        )
        
        # Parse the JSON response from Wapiti output
        wapiti_output = json.loads(wapiti_result.stdout)
        
        # Return the parsed JSON result directly as part of the response
        return jsonify({
            "status": "Completed",
            "result": wapiti_output
        }), 200
    
    except subprocess.CalledProcessError as e:
        return jsonify({
            "status": "Failed",
            "error": str(e)
        }), 500
    
    except json.JSONDecodeError as e:
        return jsonify({
            "status": "Failed",
            "error": "Failed to parse JSON output",
            "details": str(e)
        }), 500
    
if __name__ == '__main__':
    app.run(debug=True)
