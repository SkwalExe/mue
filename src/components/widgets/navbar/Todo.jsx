import variables from 'modules/variables';
import { PureComponent } from 'react';
import { MdChecklist, MdPushPin, MdDelete, MdPlaylistAdd } from 'react-icons/md';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Tooltip from '../../helpers/tooltip/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import { shift, useFloating } from '@floating-ui/react-dom';
//import Hotkeys from 'react-hot-keys';

class Todo extends PureComponent {
  constructor() {
    super();
    this.state = {
      todo: JSON.parse(localStorage.getItem('todoContent')) || [
        {
          value: '',
          done: false,
        },
      ],
      visibility: localStorage.getItem('todoPinned') === 'true' ? 'visible' : 'hidden',
      marginLeft: localStorage.getItem('refresh') === 'false' ? '-200px' : '-130px',
      showTodo: localStorage.getItem('todoPinned') === 'true',
    };
  }

  showTodo() {
    this.setState({
      showTodo: true,
    });
  }

  hideTodo() {
    if (localStorage.getItem('todoPinned') === 'true') {
      this.setState({
        showTodo: true,
      });
    } else {
      this.setState({
        showTodo: false,
      });
    }
  }

  updateTodoState(todoContent) {
    localStorage.setItem('todoContent', JSON.stringify(todoContent));
    this.setState({
      todo: todoContent,
    });
    this.forceUpdate();
  }

  setTodo(index, data) {
    let todoContent = this.state.todo;
    todoContent[index] = {
      value: data.target.value,
      done: todoContent[index].done,
    };
    this.updateTodoState(todoContent);
  }

  addTodo() {
    let todoContent = this.state.todo;
    todoContent.push({
      value: '',
      done: false,
    });
    this.updateTodoState(todoContent);
  }

  removeTodo(index) {
    let todoContent = this.state.todo;
    todoContent.splice(index, 1);
    if (todoContent.length === 0) {
      todoContent.push({
        value: '',
        done: false,
      });
    }
    this.updateTodoState(todoContent);
  }

  doneTodo(index) {
    let todoContent = this.state.todo;
    todoContent[index].done = !todoContent[index].done;
    this.updateTodoState(todoContent);
  }

  pin() {
    variables.stats.postEvent('feature', 'Todo pin');
    if (localStorage.getItem('todoPinned') === 'true') {
      localStorage.setItem('todoPinned', false);
      this.setState({
        showTodo: false,
      });
    } else {
      localStorage.setItem('todoPinned', true);
      this.setState({
        showTodo: true,
      });
    }
  }

  render() {
    return (
      <div className="notes" onMouseLeave={() => this.hideTodo()} onFocus={() => this.showTodo()}>
        <button
          className="first"
          onMouseEnter={() => this.showTodo()}
          onFocus={() => this.hideTodo()}
          onBlur={() => this.showTodo()}
          ref={this.props.todoRef}
        >
          <MdChecklist className="topicons" />
        </button>
        {this.state.showTodo && (
          <span
            className="notesContainer"
            ref={this.props.floatRef}
            style={{
              position: this.props.position,
              top: this.props.yPosition ?? '44px',
              left: this.props.xPosition ?? '',
            }}
          >
            <div className="flexTodo">
              <div className="topBarNotes" style={{ display: 'flex' }}>
                <MdChecklist />
                <span>Todo</span>
              </div>
              <div className="notes-buttons">
                <Tooltip title="Pin">
                  <button onClick={() => this.pin()}>
                    <MdPushPin />
                  </button>
                </Tooltip>
                <Tooltip title={'Add'}>
                  <button onClick={() => this.addTodo()}>
                    <MdPlaylistAdd />
                  </button>
                </Tooltip>
              </div>
              <div className={'todoRows'}>
                {this.state.todo.map((value, index) => (
                  <div
                    className={'todoRow' + (this.state.todo[index].done ? ' done' : '')}
                    key={index}
                  >
                    <Checkbox
                      checked={this.state.todo[index].done}
                      onClick={() => this.doneTodo(index)}
                    />
                    <TextareaAutosize
                      placeholder={variables.language.getMessage(
                        variables.languagecode,
                        'widgets.navbar.notes.placeholder',
                      )}
                      value={this.state.todo[index].value}
                      onChange={(data) => this.setTodo(index, data)}
                      readOnly={this.state.todo[index].done}
                    />
                    <MdDelete onClick={() => this.removeTodo(index)} />
                  </div>
                ))}
              </div>
            </div>
          </span>
        )}
      </div>
    );
  }
}
export default function TodoWrapper() {
  const { x, y, reference, floating, strategy } = useFloating({
    placement: 'bottom',
    middleware: [shift()],
  });

  return (
    <Todo todoRef={reference} floatRef={floating} position={strategy} xPosition={x} yPosition={y} />
  );
}
