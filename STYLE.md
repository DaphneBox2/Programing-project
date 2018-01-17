Name: Daphne Box
Studentnumber: 10455701
Summary: Style guide for the programming project course. It was composed with the rest of the group members and then everyone tailored the style guide to its own preferences.

#Names:
- camelCase
- Names are short, accurate and try to describe the intent of the code.

```javascript
var aVariable = 10
const aSecondVariable = 'String'
```

#Headers:
- Contains:
    - Name
    - Studentnumber
    - Summary of the programs intent
- In the top of the file in a multi-line comment
- Do not explain functions or other details of the code

```javascript
/*
    Name:
    Studentnumber:
    Summary:
*/
```

#Formatting
- Add white space after if statement, for loops, while loops, functions so that it is clear which elements belong together
- Indents are done with the tab key. 1 tab for 1 indent
- 1 space between accolades and brackets like so: { return test }
- No space between square brackets to indicate place in list like so: variable[i]
- Calculations also have spaces like so: test / 2 and not test/2
- Double quotes for strings
- Functions are described with multi line comments
- lines of code are described on a single line with single line comments.

```javascript
/**
 * this is a function
 * that does something
 */
function make(tag) {

  // ...

  return element;
}
```

#Decomposition
- Routines perform a very limited set of tasks and the number of parameters and shared variables is limited.

```javascript
// like so
const increasedByOne = [];
numbers.forEach((num) => {
  increasedByOne.push(num + 1);
});

// or like this
const increasedByOne = numbers.map(num => num + 1);
```

#Modularization
- Modules are defined such that communication between them is limited. Modules have clearly defined responsibilities, contain few variables and a somewhat limited amount of routines.

```javascript
// module import like so
import styleGuide from './styleGuide';
```
