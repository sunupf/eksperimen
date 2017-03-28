require "selenium-webdriver"

class Test
  def initialize(testCase,driver)
    @testCase =  testCase
    @driver =  driver
  end
  def run
    # Here some example
    wait = Selenium::WebDriver::Wait.new(:timeout => 30)
    wait.until { @driver.find_element(:css => '.sub-activity a.add.icon-action').displayed? }

    element = @driver.find_element(:css => '.sub-activity a.add.icon-action')
    element.click

    wait.until { @driver.find_element(:css => '#add-sub-activity .uk-modal-dialog').displayed? }

    inputs = @testCase['testCases']

    inputs.each do |key,input|
      if(key === "ids")
        ids = input.split("#")
        id = @driver.find_element :css => "#add-sub-activity #activity-id"
        todoId = @driver.find_element :css => "#add-sub-activity #todo-id"
        @driver.execute_script("arguments[0].value='#{ids.first}'" , id)
        @driver.execute_script("arguments[0].value='#{ids.last}'" , todoId)
      else
        element = @driver.find_element :css => "#add-sub-activity #{key}"        
        element.send_keys input
      end
    end

    buttonSubmit = @driver.find_element :css => "#add-sub-activity .uk-button-primary"
    buttonSubmit.click
    # # #
    wait = Selenium::WebDriver::Wait.new(:timeout => 30)
    wait.until { @driver.find_element :css => ".showSweetAlert.visible h2, #add-sub-activity .uk-alert.uk-alert-danger .uk-list li, .uk-alert.uk-alert-danger p" }

    respons = @driver.find_elements :css => ".showSweetAlert.visible h2, #add-sub-activity .uk-alert.uk-alert-danger .uk-list li, .uk-alert.uk-alert-danger p"

    result = Array.new

    respons.each do |respon|
      result.push respon.text
    end

    expect = @testCase['messages']
    puts expect
    puts "////"
    puts result
    return Set.new(expect) === Set.new(result)
  end
end
