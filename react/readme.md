1.  To do complex frontend we can use react
    Main Topic
    A. Core=> States,UI Manipulation,JSX(Writing HTML in JS)
    B. Component Ruseability => How to use buttons everywhere
    C. Resuing of components => property of objects
    D. Change propogation =>  Change is not directly shown it will shown by   using hooks

    Additional Topics
    A. Router => React dont have its own router we can use library e.g without reload page show data
    B. State Management => React don't have state management it can be done by using Redux,Redux toolkit,zustand, context API

2. npx create-react-app <projectname> to start react app but it provides bulky
   utility hence not good idea. we can use bundler like "vite".
   npm create vite@latest

3. When we create function in JSX to retun HTML tags it required only one tag
   it cannot take more than on tag e.g <h1>Hello world</h1> we cannot add another <h1>,<p>. to overcome this we can wrap this entire content into single
   <div>                            <>              // fragment
        <h1></h1>           OR          <h1></h1>
        <p></p>                         <p></p>
   </div>                           </>

4. We can declare variables in tag as <h1>{username}</h1>.where {} in this bra
   ckets we give evaluate expressions.Which means final outcome of JS .we 
   cannot give like {if(true){.....}}.

5. In react if we manipulate dom like updating variables to reflect updated var-
   iables into UI we need to use hooks like {useState}.Main advantage of hooks is that wherever the same variale is present it will going to reflect the value in all field.Wherevas in traditional JS we need to select field
   https://react.dev/learn/state-a-components-memory

6. Fibre is an algo to start ,stop the UI change. as there is some cases where we dont need to
   reflect the changes immediately.
   Reconciliation is an diff algorithm usually called as "Virtual DOM" which helps to update 
   only changes in DOM rather than rendering whole DOM.

7. "flex justify-centre" put item horizontally at centre and "flex item-centre" put item       vertically centre

8. h-screen class ensures that the container takes up the full height of the screen, allowing for vertical centering to be visible.

9. the block class ensures that both the label and the input are displayed as block-level elements, taking up the full width of their container.

10. The w-full class makes the input box take up the full width of its container by default, and md:w-auto makes it take up only as much width as necessary on medium-sized screens and above, allowing it to resize responsively.