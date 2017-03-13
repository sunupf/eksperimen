require "selenium-webdriver"

class Test
  def initialize(testCase,driver)
    @testCase =  testCase
    @driver =  driver
  end
  def run
    # Here some example
    wait = Selenium::WebDriver::Wait.new(:timeout => 30)
    wait.until { @driver.find_element(:css => '#todo-list').displayed? }

    url = @testCase['testCases']['target']
    id = url.split("/").last

    action = @driver.action
    begin
      element = @driver.find_element :css => "#todo-list li#todo-#{id}"
      update = @driver.find_element :css => "#todo-list li#todo-#{id} .edit"
    rescue
      element = @driver.find_element :css => "#todo-list li:last-child"
      update = @driver.find_element :css => "#todo-list li:last-child .edit"
      id = update.attribute("id")
    end

    action.move_to(element).move_to(update).click().perform();

    wait.until {
      @driver.find_element(:css => '#update-todo .uk-modal-dialog').displayed?
    }

    wait.until {
      el = @driver.find_element(:css => '#update-todo .uk-modal-dialog #todo-title')
      text_value = @driver.execute_script("return arguments[0].value" , el)
      puts text_value.empty?
      el if !text_value.empty?
    }

    inputs = @testCase['testCases']

    inputs.each do |key,input|
      if(key != "target")
        element = @driver.find_element :css => "#update-todo #{key}"
        element.clear
        element.send_keys input
      end
    end
    form = @driver.find_element :css => "#update-todo .uk-modal-dialog form"
    @driver.execute_script("arguments[0].setAttribute('action','#{url}')" , form)

    buttonSubmit = @driver.find_element :css => "#update-todo .uk-button-primary"
    buttonSubmit.click

    wait = Selenium::WebDriver::Wait.new(:timeout => 30)
    wait.until { @driver.find_element(:css => '.showSweetAlert.visible h2, #update-todo .uk-alert.uk-alert-danger .uk-list li, .uk-alert.uk-alert-danger p') }
    respons = @driver.find_elements :css => '.showSweetAlert.visible h2, #update-todo .uk-alert.uk-alert-danger .uk-list li, .uk-alert.uk-alert-danger p'


    expected = @testCase['messages']
    result = Array.new

    respons.each do |respon|
      result.push respon.text
    end

    puts "expected : #{expected}"
    puts "////"
    puts "respons : #{result}"
    return result === expected
  end
end
