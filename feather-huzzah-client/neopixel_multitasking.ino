#include <ESP8266WiFi.h> // Include the ESP8266 Library
#include <Adafruit_NeoPixel.h> // Include the adafruit Neopixel Library
#include <WebSocketsClient.h> // Include Socket.IO client library to communicate with RPi & Server!

const char* ssid     = "NETWORK_NAME";
const char* password = "PASSWORD";

// Set up the Neopixel Strips
// Pattern types supported:
enum  pattern { NONE, RAINBOW_CYCLE, THEATER_CHASE, COLOR_WIPE, SCANNER, FADE };
// Patern directions supported:
enum  direction { FORWARD, REVERSE };

// NeoPattern Class - derived from the Adafruit_NeoPixel class
class NeoPatterns : public Adafruit_NeoPixel
{
    public:

    // Member Variables:
    pattern  ActivePattern;  // which pattern is running
    direction Direction;     // direction to run the pattern

    unsigned long Interval;   // milliseconds between updates
    unsigned long lastUpdate; // last update of position

    uint32_t Color1, Color2;  // What colors are in use
    uint16_t TotalSteps;  // total number of steps in the pattern
    uint16_t Index;  // current step within the pattern

    void (*OnComplete)();  // Callback on completion of pattern

    // Constructor - calls base-class constructor to initialize strip
    NeoPatterns(uint16_t pixels, uint8_t pin, uint8_t type, void (*callback)())
    :Adafruit_NeoPixel(pixels, pin, type)
    {
        OnComplete = callback;
    }

    // Update the pattern
    void Update()
    {
        if((millis() - lastUpdate) > Interval) // time to update
        {
            lastUpdate = millis();
            switch(ActivePattern)
            {
                case RAINBOW_CYCLE:
                    RainbowCycleUpdate();
                    break;
                case THEATER_CHASE:
                    TheaterChaseUpdate();
                    break;
                case COLOR_WIPE:
                    ColorWipeUpdate();
                    break;
                case SCANNER:
                    ScannerUpdate();
                    break;
                case FADE:
                    FadeUpdate();
                    break;
                default:
                    break;
            }
        }
    }

    // Increment the Index and reset at the end
    void Increment()
    {
        if (Direction == FORWARD)
        {
           Index++;
           if (Index >= TotalSteps)
            {
                Index = 0;
                if (OnComplete != NULL)
                {
                    OnComplete(); // call the competion callback
                }
            }
        }
        else // Direction == REVERSE
        {
            --Index;
            if (Index <= 0)
            {
                Index = TotalSteps-1;
                if (OnComplete != NULL)
                {
                    OnComplete(); // call the comlpetion callback
                }
            }
        }
    }

    // Reverse pattern direction
    void Reverse()
    {
        if (Direction == FORWARD)
        {
            Direction = REVERSE;
            Index = TotalSteps-1;
        }
        else
        {
            Direction = FORWARD;
            Index = 0;
        }
    }

    // Initialize for a RainbowCycle
    void RainbowCycle(uint8_t interval, direction dir = FORWARD)
    {
        ActivePattern = RAINBOW_CYCLE;
        Interval = interval;
        TotalSteps = 255;
        Index = 0;
        Direction = dir;
    }

    // Update the Rainbow Cycle Pattern
    void RainbowCycleUpdate()
    {
        for(int i=0; i< numPixels(); i++)
        {
            setPixelColor(i, Wheel(((i * 256 / numPixels()) + Index) & 255));
        }
        show();
        Increment();
    }

    // Initialize for a Theater Chase
    void TheaterChase(uint32_t color1, uint32_t color2, uint8_t interval, direction dir = FORWARD)
    {
        ActivePattern = THEATER_CHASE;
        Interval = interval;
        TotalSteps = numPixels();
        Color1 = color1;
        Color2 = color2;
        Index = 0;
        Direction = dir;
   }

    // Update the Theater Chase Pattern
    void TheaterChaseUpdate()
    {
        for(int i=0; i< numPixels(); i++)
        {
            if ((i + Index) % 3 == 0)
            {
                setPixelColor(i, Color1);
            }
            else
            {
                setPixelColor(i, Color2);
            }
        }
        show();
        Increment();
    }

    // Initialize for a ColorWipe
    void ColorWipe(uint32_t color, uint8_t interval, direction dir = FORWARD)
    {
        ActivePattern = COLOR_WIPE;
        Interval = interval;
        TotalSteps = numPixels();
        Color1 = color;
        Index = 0;
        Direction = dir;
    }

    // Update the Color Wipe Pattern
    void ColorWipeUpdate()
    {
        setPixelColor(Index, Color1);
        show();
        Increment();
    }

    // Initialize for a SCANNNER
    void Scanner(uint32_t color1, uint8_t interval)
    {
        ActivePattern = SCANNER;
        Interval = interval;
        TotalSteps = (numPixels() - 1) * 2;
        Color1 = color1;
        Index = 0;
    }

    // Update the Scanner Pattern
    void ScannerUpdate()
    {
        for (int i = 0; i < numPixels(); i++)
        {
            if (i == Index)  // Scan Pixel to the right
            {
                 setPixelColor(i, Color1);
            }
            else if (i == TotalSteps - Index) // Scan Pixel to the left
            {
                 setPixelColor(i, Color1);
            }
            else // Fading tail
            {
                 setPixelColor(i, DimColor(getPixelColor(i)));
            }
        }
        show();
        Increment();
    }

    // Initialize for a Fade
    void Fade(uint32_t color1, uint32_t color2, uint16_t steps, uint8_t interval, direction dir = FORWARD)
    {
        ActivePattern = FADE;
        Interval = interval;
        TotalSteps = steps;
        Color1 = color1;
        Color2 = color2;
        Index = 0;
        Direction = dir;
    }

    // Update the Fade Pattern
    void FadeUpdate()
    {
        // Calculate linear interpolation between Color1 and Color2
        // Optimise order of operations to minimize truncation error
        uint8_t red = ((Red(Color1) * (TotalSteps - Index)) + (Red(Color2) * Index)) / TotalSteps;
        uint8_t green = ((Green(Color1) * (TotalSteps - Index)) + (Green(Color2) * Index)) / TotalSteps;
        uint8_t blue = ((Blue(Color1) * (TotalSteps - Index)) + (Blue(Color2) * Index)) / TotalSteps;

        ColorSet(Color(red, green, blue));
        show();
        Increment();
    }

    // Calculate 50% dimmed version of a color (used by ScannerUpdate)
    uint32_t DimColor(uint32_t color)
    {
        // Shift R, G and B components one bit to the right
        uint32_t dimColor = Color(Red(color) >> 1, Green(color) >> 1, Blue(color) >> 1);
        return dimColor;
    }

    // Set all pixels to a color (synchronously)
    void ColorSet(uint32_t color)
    {
        for (int i = 0; i < numPixels(); i++)
        {
            setPixelColor(i, color);
        }
        show();
    }

    // Returns the Red component of a 32-bit color
    uint8_t Red(uint32_t color)
    {
        return (color >> 16) & 0xFF;
    }

    // Returns the Green component of a 32-bit color
    uint8_t Green(uint32_t color)
    {
        return (color >> 8) & 0xFF;
    }

    // Returns the Blue component of a 32-bit color
    uint8_t Blue(uint32_t color)
    {
        return color & 0xFF;
    }

    // Input a value 0 to 255 to get a color value.
    // The colours are a transition r - g - b - back to r.
    uint32_t Wheel(byte WheelPos)
    {
        WheelPos = 255 - WheelPos;
        if(WheelPos < 85)
        {
            return Color(255 - WheelPos * 3, 0, WheelPos * 3);
        }
        else if(WheelPos < 170)
        {
            WheelPos -= 85;
            return Color(0, WheelPos * 3, 255 - WheelPos * 3);
        }
        else
        {
            WheelPos -= 170;
            return Color(WheelPos * 3, 255 - WheelPos * 3, 0);
        }
    }
};

void Strip1Complete();
void Strip2Complete();
void Strip3Complete();
void PixelsComplete();

// Define some NeoPatterns for the two rings and the stick
// as well as some completion routines
NeoPatterns Strip1(31, 2, NEO_GRB + NEO_KHZ800, &Strip1Complete);
NeoPatterns Strip2(34, 5, NEO_GRB + NEO_KHZ800, &Strip2Complete);
NeoPatterns Strip3(26, 4, NEO_GRB + NEO_KHZ800, &Strip3Complete);
NeoPatterns PixelsLeft(7, 14, NEO_GRB + NEO_KHZ800, &PixelsComplete);
NeoPatterns PixelsRight(7, 12, NEO_GRB + NEO_KHZ800, &PixelsComplete);

WiFiClient client;
WebSocketsClient webSocket;

#define MESSAGE_INTERVAL 10000
#define HEARTBEAT_INTERVAL 5000


uint64_t messageTimestamp = 0;
uint64_t heartbeatTimestamp = 0;
bool isConnected = false;

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
    String msg;
    switch(type) {
        case WStype_DISCONNECTED:
            Serial.printf("[WSc] Disconnected!\n");
            isConnected = false;
            break;
        case WStype_CONNECTED:
            {
                Serial.printf("[WSc] Connected to url: %s\n",  payload);
                isConnected = true;

                // send message to server when Connected
                // socket.io upgrade confirmation message (required)
                webSocket.sendTXT("5");
            }
            break;
        case WStype_TEXT:
            msg = String((char*)payload);
            if(msg.startsWith("42")) {
              trigger(getEventName(msg).c_str(), getEventPayload(msg).c_str(), length);
            }
            break;
        case WStype_BIN:
            Serial.printf("[WSc] get binary length: %u\n", length);
            hexdump(payload, length);

            // send data to server
            // webSocket.sendBIN(payload, length);
            break;
    }
}

const String getEventName(const String msg) {
  return msg.substring(4, msg.indexOf("\"",4));
}

const String getEventPayload(const String msg) {
  String result = msg.substring(msg.indexOf("\"",4)+2,msg.length()-1);
  if(result.startsWith("\"")) {
    result.remove(0,1);
  }
  if(result.endsWith("\"")) {
    result.remove(result.length()-1);
  }
  return result;
}

void trigger(const char* event, const char * payload, size_t length) {
  if(strcmp(event, "shirtColors") == 0) {
    Serial.printf("[WSc] trigger event %s\n", event);
    shirtColors(payload, length);
  }
}

void shirtColors(const char * colors, size_t length) {
  char * pEnd;
  int number = (int) strtol(colors, &pEnd, 16);
  int r = number >> 16;
  int g = number >> 8 & 0xFF;
  int b = number & 0xFF;

  int number2 = (int) strtol(pEnd, &pEnd, 16);
  int r2 = number2 >> 16;
  int g2 = number2 >> 8 & 0xFF;
  int b2 = number2 & 0xFF;

//    Strip1.Fade(Strip1.Color(255, 0, 0), Strip1.Color(0, 0, 255), 255, 10);
//    Strip2.Fade(Strip2.Color(255, 0, 0), Strip2.Color(0, 0, 255), 255, 10);
//    Strip3.Fade(Strip3.Color(255, 0, 0), Strip3.Color(0, 0, 255), 255, 10);

  Strip1.TheaterChase(Strip1.Color(r,g,b), Strip1.Color(r2,g2,b2), 200);
  Strip2.TheaterChase(Strip2.Color(r,g,b), Strip2.Color(r2,g2,b2), 200);
  Strip3.TheaterChase(Strip3.Color(r,g,b), Strip3.Color(r2,g2,b2), 200);

  PixelsLeft.TheaterChase(PixelsLeft.Color(r,g,b), PixelsLeft.Color(r2,g2,b2), 200);
  PixelsRight.TheaterChase(PixelsRight.Color(r,g,b), PixelsRight.Color(r2,g2,b2), 200);
}

void setup() {
  // Initialize all the pixelStrips
  Strip1.begin();
  Strip2.begin();
  Strip3.begin();
//  PixelsLeft.begin();
//  PixelsRight.begin();
  Strip1.setBrightness(200);
  Strip2.setBrightness(200);
  Strip3.setBrightness(200);
//  PixelsLeft.setBrightness(100);
//  PixelsRight.setBrightness(100);
  Strip1.show();
  Strip2.show();
  Strip3.show();
//  PixelsLeft.show();
//  PixelsRight.show();

  Serial.begin(115200); // Get ready for serial communications and display the connection status
  Serial.print("Connecting to WiFi network -  ");

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected!!!!!!!");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  delay(10);
  webSocket.beginSocketIO("light-art.herokuapp.com", 80);
  webSocket.onEvent(webSocketEvent);
  delay(10);
}

void loop() {
  webSocket.loop();

  delay(10);

  if(isConnected) {

      uint64_t now = millis();

      if(now - messageTimestamp > MESSAGE_INTERVAL) {
        messageTimestamp = now;
        // example socket.io message with type "messageType" and JSON payload
        webSocket.sendTXT("42[\"messageType\",{\"greeting\":\"hello\"}]");
        delay(10);
      }
      if((now - heartbeatTimestamp) > HEARTBEAT_INTERVAL) {
        heartbeatTimestamp = now;
        // socket.io heartbeat message
        webSocket.sendTXT("2");
        delay(10);
      }
   } else {
      Serial.printf("[WSc] Reconnected!\n");
      WiFi.begin(ssid, password);
      delay(10);
      webSocket.beginSocketIO("light-art.herokuapp.com", 80);
      isConnected = true;
    }

  Strip1.Update();
  Strip2.Update();
  Strip3.Update();
  PixelsLeft.Update();
  PixelsRight.Update();
}

//------------------------------------------------------------
//Completion Routines - get called on completion of a pattern
//------------------------------------------------------------

// Strip1 Completion Callback
void Strip1Complete()
{
}

// Strip2 Completion Callback
// It's the longest strip, so clear it when done
void Strip2Complete()
{
    // Stop marquee when longest strip is done
    Strip1.ColorWipe(0, 0);
    Strip2.ColorWipe(0, 0);
    Strip3.ColorWipe(0, 0);
    PixelsLeft.ColorWipe(0, 0);
    PixelsRight.ColorWipe(0, 0);
}

// Strip3 Completion Callback
void Strip3Complete()
{
}

// Individual Pixels Completion Callback
void PixelsComplete()
{
}
