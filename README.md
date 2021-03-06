# ShopHours configurator

  ShopHours configurator has been implemented to enter the opening and closing times of your shop.
  
  ![html5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
  ![javascript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
  ![css3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
  
  [![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)](https://code.visualstudio.com/)
  [![NetBeans IDE](https://img.shields.io/badge/NetBeansIDE-1B6AC6.svg?style=for-the-badge&logo=apache-netbeans-ide&logoColor=white)](https://netbeans.apache.org/download/index.html)
  [![Sublime Text](https://img.shields.io/badge/sublime_text-%23575757.svg?style=for-the-badge&logo=sublime-text&logoColor=important)](https://www.sublimetext.com/)
  
  
  ![repo size](https://img.shields.io/github/repo-size/MarioSenese/ShopHours?style=for-the-badge)
  [![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/MarioSenese/)
  
  [![license](https://img.shields.io/github/license/MarioSenese/ShopHours?style=for-the-badge)](https://github.com/MarioSenese/ShopHours/blob/main/LICENSE)
  
  [![npm vesion](https://img.shields.io/npm/v/@mariosenese/shophours?style=for-the-badge)](https://www.npmjs.com/package/@mariosenese/shophours)
  [![npm size min](https://img.shields.io/bundlephobia/min/@mariosenese/shophours?style=for-the-badge)](https://www.npmjs.com/package/@mariosenese/shophours)


##  Install
  ```
  $ npm install @mariosenese/shophours
  ```
##  Usage
Call external js and css files, into header:
```html
<head>
    <script src="js/index.js" async></script>
    <link href="css/style.css" rel="stylesheet" type="text/css" />
</head>
```
  Insert html code in your page:
    
```html
<div id="hours" >
    <fieldset>
      <legend>Shop Hours</legend>
        <div class="shops">
            <div class="h monday friday">
                <div class="morning">
                    <span class="from">
                        <input type="text" class="time" value="06:00" readonly />
                    </span>
                    <span class="to">
                        <input type="text" class="time" value="14:00" readonly />                                
                    </span>
                </div>
                <div class="afternoon">
                    <span class="from">
                        <input type="text" class="time" value="15:00" readonly />
                    </span>
                    <span class="to">
                        <input type="text" class="time" value="20:00" readonly />                                
                    </span>
                </div>
            </div>
            <div class="h saturday">
                <div class="morning">
                    <span class="from">
                        <input type="text" class="time" value="06:00" readonly />                                
                    </span>
                    <span class="to">
                        <input type="text" class="time" value="14:00" readonly />                                
                    </span>
                </div>
            </div>
        </div>
    </fieldset>
</div>
```


  Note: It has been used normally
  ```html
  <input type="text" ... />
  ```
  and not the classic
   ```html
    <input type="time" ... />
  ```
